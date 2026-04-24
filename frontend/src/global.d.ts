interface AppChatMessage {
    id: number;
    user: string;
    text: string;
}

interface POSTReqBody {
    content: string;
}

interface WSSendData {
    type: 'message';
    content: AppChatMessage;
}
