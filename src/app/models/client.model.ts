import { Person } from "./person.model";

export class Client {

    id!: string
    image!: {
        data: "",
        type: 0
    }

    constructor(
        public userType: Number = 3,
        public person: Person = {
            name: "",
            phone: "",
            email: "",
            address: ""
        }
    ) { }

}
