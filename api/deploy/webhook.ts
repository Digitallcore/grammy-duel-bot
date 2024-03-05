import * as dotenv from 'dotenv'
import axios, {AxiosResponse} from "axios";
dotenv.config()
export const deployWebhook = async <T>(): Promise<any> => {
    try {
        const response: AxiosResponse<T> = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook`, {
            url: `${process.env.DEPLOY_URL}`
        })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

