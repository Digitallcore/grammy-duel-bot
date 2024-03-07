interface msgStore {
    sender_id: number,
    sender_username: string,
    bot_reply_message_id: number
}
const setMessageStore = (id: number, username: string, bot_reply_id: number) => {
    messageStore.sender_id = id
    messageStore.sender_username = username
    messageStore.bot_reply_message_id = bot_reply_id
}
const resetMessageStore = () => {
    messageStore.sender_id = 0
    messageStore.sender_username = ''
    messageStore.bot_reply_message_id = 0
}
const messageStore: msgStore = {
    sender_id: 0,
    sender_username: '',
    bot_reply_message_id: 0
}

export { messageStore, resetMessageStore, setMessageStore }

