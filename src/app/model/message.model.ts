export class MessageModel {
    id?: string;
    text: string;
    timestamp: number;
    sender: {
        id: string,
        name: string
    }
}
