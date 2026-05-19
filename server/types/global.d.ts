interface Message {
    timestamp: number;

    user: string;
    text: string;
}

interface WSSendData {
    type: 'message';
    content: Message;
}
