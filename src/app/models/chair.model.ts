import { Barber } from "./barber.model";

export class Chair {
    id?: string;
    customId?: number;
    formatedStartDate?= "";
    formatedEndDate?= "";

    constructor(
        public barber: Barber = new Barber(),
        public startDate: Date | undefined = new Date(),
        public endDate: Date | undefined = new Date()
    ) { }

}
