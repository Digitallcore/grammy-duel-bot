import { Bot, Context, webhookCallback } from "grammy";
const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");
const bot = new Bot(token);
const array = ['руку', 'ногу', 'глаз', 'яйцо', 'палец']
let sender_id: number = 0
let senderUsername: string = ''
let botReplyMessageId: number = 0
// Handle other messages.
bot.on("message", async (ctx: Context) => {
    // catch 'duel' message and it to object
    if (ctx.message?.text?.toLowerCase().includes('дуэль')) {
        const reply = await ctx.reply('Кого вызываете на дуэль?', {reply_to_message_id: ctx.message?.message_id})
        console.log(reply)
        botReplyMessageId = reply.message_id
        sender_id = ctx.message.from.id
        senderUsername = `@${ctx.message.from.username}`
    }

    //wait for reply to previous message
    if (botReplyMessageId === ctx.message?.reply_to_message?.message_id && sender_id === ctx.message.from.id) {
        const opponent_regex = /.*\B@(?=\w{5,32}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*.*/
        const opponentName = <string> ctx.message.text
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
                await ctx.reply(`${senderDamage > replierDamage ? senderUsername : opponentName} отстреливает ${array[Math.floor(Math.random() * array.length)]} ${senderDamage > replierDamage ? opponentName : senderUsername} и выходит победителем из дуэли!`)
                sender_id = 0
                senderUsername = ''
                botReplyMessageId = 0
            }
        }
    }
});



export default webhookCallback(bot, "http");