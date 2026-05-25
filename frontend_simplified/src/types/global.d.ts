interface ChatMessage {
    id: number;
    user: string;
    text: string;
    timestamp: number;
}

interface POSTReqBody {
    /** Sent message. */
    content: ChatMessage;
}

interface WSSendData {
    type: 'message';
    content: ChatMessage;
}
