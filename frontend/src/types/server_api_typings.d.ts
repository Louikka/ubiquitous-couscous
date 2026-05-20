export interface Message {
    /** Timestamp (in ms) when the message was sent. */
    timestamp: number;

    user: string;
    text: string;
}

export interface WSSendData {
    type: 'message';
    content: Message;
}
