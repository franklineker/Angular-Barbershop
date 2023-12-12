
export class Barber {

    id!: string
    profilePicture!: {
        data: string
        type: number
    }

    currentRating!: number
    ratingsArray!: []

    constructor(
        public userType = 0,
        public about = "",
        public image?: File,
        public person = {
            name: "",
            phone: "",
            email: "",
            address: ""
        }
    ) { }

}



