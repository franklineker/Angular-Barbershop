import { Barber } from "./barber.model";

export class Chair {
    id?: string;
    customId?: number;
    // barber: Barber
    // startDate: string
    // endDate: string

    constructor(
        public barberName: string,
        public startDate: string,
        public endDate: string
    ) { }

}
