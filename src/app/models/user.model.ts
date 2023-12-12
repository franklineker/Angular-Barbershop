export class User {

    constructor(
        public fullName: string,
        public email: string,
        public password: string,
        public roles: Array<string>
    ) { }
}
