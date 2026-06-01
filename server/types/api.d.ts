export interface JWTToken {
    username: string;
    password: string;
}


export interface LoginResponseInterface {
    token: string;
    ok: boolean;
    error_message?: string;
}



export type Message = {
    type: 'message';
    /** Timestamp (in ms) when the message was sent. */
    timestamp: number;
    content: {
        user: string;
        text: string;
    };
};
export type Error = {
    type: 'error';
    /** Timestamp (in ms) when the error occured. */
    timestamp: number;
    content: {
        text: string;
    };
};

export type ChatMessage = Message | Error;
