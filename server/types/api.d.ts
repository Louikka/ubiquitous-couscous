export interface UserCredentials {
    username: string;
    password: string;
}

export interface ChatMessage {
    username: string;
    text: string;
    timestamp: number;
}


export interface DBUserEntry {
    username: string;
    /** Encoded. */
    password: string;
    salt: string;
    /** ID's of chats. */
    active_chats: Array<string>;
    own_chats: Array<string>;
}

export interface DBChatEntry {
    id: string;
    name: string;
    /** User's name. */
    owner: string;
    messages: Array<ChatMessage>;
}

type UserSensitiveData = 'password' | 'salt';
/** User's data from DB with all sensitive data omitted. */
export type UserData = Omit<DBUserEntry, UserSensitiveData>;



export namespace API {

    namespace register {
        namespace get {}
        namespace post {
            namespace req {
                interface body {
                    username: string;
                    password: string;
                }
            }
            namespace res {
                interface body {
                    token: string;
                }
            }
        }
    }

    namespace login {
        namespace get {}
        namespace post {
            namespace req {
                interface body {
                    username: string;
                    password: string;
                }
            }
            namespace res {
                interface body {
                    token: string;
                }
            }
        }
    }

    namespace user {
        namespace get {
            namespace req {}
            namespace res {
                interface body extends UserData {}
            }
        }
        namespace post {}
    }

    namespace chat {
        namespace get {
            namespace req {
                interface body {
                    chat_id: string;
                }
            }
            namespace res {
                interface body {
                    chat: DBChatEntry;
                }
            }
        }
        namespace post {
            namespace req {
                interface body {
                    chat_name: string;
                }
            }
            namespace res {}
        }
    }

    namespace messages {
        namespace get {
            namespace req {
                interface body {
                    username: string;
                }
            }
            namespace res {}
        }
        namespace post {
            namespace req {
                interface body {
                    message: string;
                }
            }
            namespace res {}
        }
    }

}
