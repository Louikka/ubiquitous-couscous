import redis from 'redis';
import { createHashFromString, hashPassword } from './lib.ts';
import type { ChatMessage, UserMessage } from '../types/api.js';


export interface DBUserEntry {
    username: string;
    /** Encoded. */
    password: string;
    salt: string;
    messages: Array<UserMessage>;
}


export class RedisClient
{
    constructor()
    {
        this.client = redis.createClient();

        this.client.on('error', (err) =>
        {
            console.error('Redis client error :', err);
        });
    }


    public readonly client;


    public async connect()
    {
        await this.client.connect();
    }


    public async isUserExists(username: string): Promise<boolean>
    {
        const user = await this.client.get(`USER_${createHashFromString(username)}`);

        return user !== null;
    }

    public async getUser(username: string): Promise<DBUserEntry | null>
    {
        const user = await this.client.get(`USER_${createHashFromString(username)}`);

        try
        {
            if (user !== null)
            {
                return JSON.parse(user) as DBUserEntry;
            }
            else
            {
                console.debug(`Unable to get user "${username}".`);
            }
        }
        catch (err)
        {
            console.error('An error occured while trying to parse UserEntry from server :', err);
            console.debug('Initial data that failed to parse :', user);
        }

        return null;
    }

    public async addNewUser(username: string, password: string)
    {
        const hashedPassword = hashPassword(password);

        const userDBName = `USER_${createHashFromString(username)}`;
        console.debug('New user added :', userDBName);

        await this.client.set(userDBName, JSON.stringify({
            username,
            password: hashedPassword.hash,
            salt: hashedPassword.salt,
            messages: [],
        } as DBUserEntry));

        await this.client.rPush('REGISTERED_USERS', userDBName);
    }


    private async getRegisteredUsers(): Promise<DBUserEntry[]>
    {
        const regUsers: DBUserEntry[] = [];

        const users = await this.client.lRange('REGISTERED_USERS', 0, -1);

        for (const username of users)
        {
            try
            {
                const user = await this.client.get(username);
                if (user !== null)
                {
                    regUsers.push(JSON.parse(user));
                }
            }
            catch (err)
            {
                console.error(err);
            }
        }

        return regUsers;
    }

    public async addUserMessage(username: string, message: UserMessage)
    {
        const user = await this.getUser(username);
        if (user === null)
        {
            console.error(`Unable to add message to the user "${username}".`);
            return;
        }

        user.messages.push(message);

        await this.client.set(`USER_${createHashFromString(username)}`, JSON.stringify(user));
    }


    public async getChatMessages(): Promise<ChatMessage[]>
    {
        const messages: Array<ChatMessage> = [];

        const regUsers = await this.getRegisteredUsers();

        for (const user of regUsers)
        {
            messages.push(...user.messages.map(m => ({ username: user.username, ...m })));
        }

        if (messages.length > 1)
        {
            messages.sort((a, b) => a.timestamp - b.timestamp);
        }

        return messages;
    }

    public async addChatMessage(m: ChatMessage)
    {
        await this.addUserMessage(m.username, { text: m.text, timestamp: m.timestamp });
    }
}
