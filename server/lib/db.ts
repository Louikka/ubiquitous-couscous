import crypto from 'crypto';
import redis from 'redis';
import { createHashFromString, hashPassword } from './lib.ts';
import type { DBChatEntry, DBUserEntry, UserData, UserSensitiveData } from '../types/api.js';


type _DBChatEntry = Omit<DBChatEntry, 'messages'>;
type _DBCharEntryMessages = DBChatEntry['messages'];


export function omitUserSensitiveData(d: DBUserEntry): UserData
{
    // see UserSensitiveData in types/api.d.ts
    [ 'password', 'salt' ].forEach((key) =>
    {
        delete d[key as UserSensitiveData];
    });

    return d;
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


    private getDBKeyFrom(value: string, as: 'user' | 'chat'): string
    {
        let s = '';

        switch (as)
        {
            case 'user':
            {
                s += 'USER';
                break;
            }
            case 'chat':
            {
                s += 'CHAT';
                break;
            }

            default:
            {
                throw new Error(`Undefined function argument "${as}"`);
            }
        }

        s += createHashFromString(value);

        return s;
    }


    public async isUserExists(username: string): Promise<boolean>
    {
        return await this.client.exists(this.getDBKeyFrom(username, 'user')) > 0;
    }

    public async getUser(username: string): Promise<DBUserEntry | null>
    {
        if (await this.isUserExists(username))
        {
            try
            {
                const user = {} as DBUserEntry;

                const _dbUser = await this.client.hGetAll(this.getDBKeyFrom(username, 'user'));
                for (const [key, value] of Object.entries(_dbUser))
                {
                    switch (key)
                    {
                        case 'active_chats':
                        {
                            user.active_chats = JSON.parse(value);
                            break;
                        }
                        case 'own_chats':
                        {
                            user.own_chats = JSON.parse(value);
                            break;
                        }

                        default:
                        {
                            user[key as keyof Omit<DBUserEntry, 'active_chats' | 'own_chats'>] = value;
                        }
                    }
                }

                return user;
            }
            catch (err)
            {
                console.error(err);
            }
        }
        else
        {
            console.debug(`Unable to get user "${username}".`);
        }

        return null;
    }

    public async updateUser(username: string, field: keyof DBUserEntry, value: any)
    {
        if (!await this.isUserExists(username))
        {
            console.error(`Unable to update field "${field}" of the user "${username}": no such user exists.`);
            return;
        }

        this.client.hSet(this.getDBKeyFrom(username, 'user'), field, value);
    }


    public async isChatExists(chatId: string): Promise<boolean>
    {
        return await this.client.exists(this.getDBKeyFrom(chatId, 'chat')) > 0;
    }

    public async getChat(chatId: string): Promise<DBChatEntry | null>
    {
        if (await this.isChatExists(chatId))
        {
            try
            {
                const chat: DBChatEntry = {
                    id: '',
                    name: '',
                    owner: '',
                    messages: [],
                };

                const _dbChat = await this.client.hGetAll(this.getDBKeyFrom(chatId, 'chat'));
                for (const [key, value] of Object.entries(_dbChat))
                {
                    chat[key as keyof _DBChatEntry] = value;
                }

                const _dbChatMessages = await this.client.lRange(this.getDBKeyFrom(chatId, 'chat') + ':MESSAGES', 0, -1);
                for (const message of _dbChatMessages)
                {
                    chat.messages.push(JSON.parse(message));
                }

                return chat;
            }
            catch (err)
            {
                console.error(err);
            }
        }
        else
        {
            console.debug(`Unable to get chat "${chatId}".`);
        }

        return null;
    }


    public async addNewUser(username: string, password: string)
    {
        const userDBKey = this.getDBKeyFrom(username, 'user');
        const hashedPassword = hashPassword(password);

        await this.client.hSet(userDBKey, 'username', username);
        await this.client.hSet(userDBKey, 'password', hashedPassword.hash);
        await this.client.hSet(userDBKey, 'salt', hashedPassword.salt);
        await this.client.hSet(userDBKey, 'active_chats', '[]');
        await this.client.hSet(userDBKey, 'own_chats', '[]');

        console.debug('Successfully added new user :', username);
    }

    public async addNewChat(name: string, owner: string)
    {
        const user = await this.getUser(owner);
        if (user === null)
        {
            console.warn(`User "${owner}" does not exists.`);
            return;
        }

        const chatId = crypto.randomUUID();
        const chatDBKey = this.getDBKeyFrom(chatId, 'chat');

        await this.client.hSet(chatDBKey, 'id', chatId);
        await this.client.hSet(chatDBKey, 'name', name);
        await this.client.hSet(chatDBKey, 'owner', owner);

        user.own_chats.push(chatId);
        user.active_chats.push(chatId);

        this.updateUser(owner, 'own_chats', JSON.stringify(user.own_chats));
        this.updateUser(owner, 'active_chats', JSON.stringify(user.active_chats));

        console.debug('Successfully added new chat :', chatId, name);
    }
}
