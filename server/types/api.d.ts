export interface UserCredentials {
    username: string;
    password: string;
}

export interface ChatMessage {
    username: string;
    text: string;
    timestamp: number;
}



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

    namespace chat {
        namespace get {
            namespace req {}
            namespace res {}
        }
        namespace post {
            namespace req {
                interface body {
                    chat_id: string;
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
