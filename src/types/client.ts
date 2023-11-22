import { IgApiClientRealtime } from "instagram_mqtt"

export type Client = {
    ig: IgApiClientRealtime,
    userId: number
}

export default Client