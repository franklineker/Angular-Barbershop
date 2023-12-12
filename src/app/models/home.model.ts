export class Home {
    // welcomeMessage!: string;
    // aboutBarbershop!: string;
    // address!: {
    //     street: string,
    //     number: string,
    //     neighborhood: string,
    //     city: string,
    //     state: string,
    // }

    constructor(
        public welcomeMessage = "",
        public aboutBarbershop = "",
        public address = {
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
        }
    ) { }
}
