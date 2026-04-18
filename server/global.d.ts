interface Message {
    id: number;
    user: string;
    text: string;
}

interface POSTReqBody {
    /** Sent message. */
    content: Message;
}

interface WSSendData {
    type: 'message';
    content: Message;
}
