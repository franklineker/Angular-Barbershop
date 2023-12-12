import { Client } from "./client.model";

export class Comment {

    id?: string;
    date?: Date;
    client!: Client;
    content!: string;
}
