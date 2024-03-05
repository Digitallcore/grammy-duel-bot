import { Bot, Context, webhookCallback } from "grammy";
import { finalPhrase } from "./helpers/phrases";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");
const bot = new Bot(token);

let sender_id: number = 0
let senderUsername: string = ''
let botReplyMessageId: number = 0
const findUsernameInMessage = (msg: string) => {
    const array = msg.split(' ')
    return array.find(nickname => nickname.startsWith('@'))!
}

bot.on("message", async (ctx: Context) => {
    // catch 'duel' message and set it to object
    if (ctx.message?.text?.toLowerCase().includes('дуэль')) {
        const reply = await ctx.reply('Кого вызываете на дуэль?', {reply_to_message_id: ctx.message?.message_id})
        botReplyMessageId = reply.message_id
        sender_id = ctx.message.from.id
        senderUsername = `@${ctx.message.from.username}`
    }

    //wait for reply to previous message
    if (botReplyMessageId === ctx.message?.reply_to_message?.message_id && sender_id === ctx.message.from.id) {
        const opponent_regex = /.*\B@(?=\w{5,32}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*.*/
        const opponentName = findUsernameInMessage(ctx.message.text!)
        if (opponent_regex.test(opponentName)) {
            if (opponentName.substring(1) === ctx.message.from.username){
                const reply = await ctx.reply(`Вы не можете вызвать себя самого на дуэль!`, {reply_to_message_id: ctx.message?.message_id})
                botReplyMessageId = reply.message_id
            } 
            else if (opponentName.substring(1) === ctx.message.reply_to_message.from?.username) {
                const reply = await ctx.reply('Я всего лишь бот, я не умею обращаться с револьвером :(', {reply_to_message_id: ctx.message?.message_id})
                botReplyMessageId = reply.message_id
            }
            else {
                await ctx.reply(`Вы вызвали ${opponentName} на дуэль!`, {reply_to_message_id: ctx.message?.message_id})
                const senderDamage = Math.floor(Math.random() * 100)
                const replierDamage = Math.floor(Math.random() * 100)
                const winner = senderDamage > replierDamage ? senderUsername : opponentName
                const loser = senderDamage > replierDamage ? opponentName : senderUsername
                await ctx.reply(finalPhrase(winner,loser))
                sender_id = 0
                senderUsername = ''
                botReplyMessageId = 0
            }
        }
    }
});

export default webhookCallback(bot, "http");