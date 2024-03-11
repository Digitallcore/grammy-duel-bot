import { Bot, Context } from "grammy";

const production = async (bot: Bot<Context>): Promise<void> => {
    try {
        const data = await bot.api.setWebhook(`${process.env.VERCEL_URL}/api/bot`);
        console.log(`[SERVER] Bot starting webhook`);
        console.log(process.env.VERCEL_URL)
    } catch (e) {
        console.error(e);
    }
};

const development = async (bot: Bot<Context>): Promise<void> => {
    try {
        await bot.api.deleteWebhook();
        console.log("[SERVER] Bot starting polling");
        await bot.start();
    } catch (e) {
        console.error(e);
    }
};

export { production, development };