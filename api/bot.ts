import { Bot, type Context, webhookCallback } from 'grammy'
import { finalPhrase } from './helpers/phrases'
import { messageStore, setMessageStore, resetMessageStore } from './stores/messageStore'
import { production } from "./helpers/launch";

const token = process.env.BOT_TOKEN
if (!token) { throw new Error('BOT_TOKEN is unset') }
const bot = new Bot(token)
production(bot)
const findUsernameInMessage = (msg: string): string => {
  const array = msg.split(' ')
  return array.find(nickname => nickname.startsWith('@')) ?? 'Тегните человека через @, чтобы вызвать его на дуэль'
}

bot.on('message', async (ctx: Context) => {
  // catch 'duel' message and set it to object
  if (ctx.message?.text?.toLowerCase().includes('дуэль')) {
    const reply = await ctx.reply('Кого вызываете на дуэль?', { reply_to_message_id: ctx.message?.message_id })
    setMessageStore(ctx.message.from.id, `@${ctx.message.from.username}`, reply.message_id)
  }

  // wait for reply to previous message
  if (messageStore.bot_reply_message_id === ctx.message?.reply_to_message?.message_id && messageStore.sender_id === ctx.message.from.id) {
    const opponentRegex = /.*\B@(?=\w{5,32}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*.*/
    const opponentName = findUsernameInMessage(ctx.message.text!)
    if (opponentRegex.test(opponentName)) {
      if (opponentName.substring(1) === ctx.message.from.username) {
        const reply = await ctx.reply('Вы не можете вызвать себя самого на дуэль!', { reply_to_message_id: ctx.message?.message_id })
        messageStore.bot_reply_message_id = reply.message_id
      } else if (opponentName.substring(1) === ctx.message.reply_to_message.from?.username) {
        const reply = await ctx.reply('Я всего лишь бот, я не умею обращаться с револьвером :(', { reply_to_message_id: ctx.message?.message_id })
        messageStore.bot_reply_message_id = reply.message_id
      } else {
        await ctx.reply(`Вы вызвали ${opponentName} на дуэль!`, { reply_to_message_id: ctx.message?.message_id })
        const senderDamage = Math.floor(Math.random() * 100)
        const replierDamage = Math.floor(Math.random() * 100)
        const winner = senderDamage > replierDamage ? messageStore.sender_username : opponentName
        const loser = senderDamage > replierDamage ? opponentName : messageStore.sender_username
        await ctx.reply(finalPhrase(winner, loser))
        resetMessageStore()
      }
    }
  }
})

export default webhookCallback(bot, 'http')
