interface Message {
    id: number;
    user: string | 'self';
    text: string;
}

interface POSTReqBody {
    content: string;
}
