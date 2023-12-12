import { Barber } from "./barber.model"
import { Client } from "./client.model";
import { Order } from "./order.model"

export interface Appointment {

    id?: string
    order: Order
    barber: Barber
    client: Client
    date: string
    formatedDate: string
    formatedHour: string
}
