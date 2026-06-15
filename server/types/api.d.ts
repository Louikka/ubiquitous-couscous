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
