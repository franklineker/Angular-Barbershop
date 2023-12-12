export class Order {

    id!: string

    image!: {
        data: string,
        type: number
    }

    constructor(
        public title: string,
        public price: number,
        public description: string,
        public uploadedImage?: File
    ) { }

}
