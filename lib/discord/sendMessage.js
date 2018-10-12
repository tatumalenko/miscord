process.on('uncaughtException', async (e) => {
  console.error(e);
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

const log = logger.withScope('discord:sendMessage')

module.exports = async (channel, cleanname, m, image) => {
  // find / create a webhook
  let webhook = discord.webhooks.find(webhook => webhook.channelID === channel.id)
  if (!webhook) {
    webhook = await channel.createWebhook(`Miscord #${cleanname}`.substr(0, 32), image || 'https://miscord.net/img/icon.png')
    discord.webhooks.set(webhook.id, webhook)
  }
  log.trace('webhook', toStr(webhook))

  log.debug('Sending the message')
  const sentMessage = await webhook.send(...m)

  log.debug('Sent message on Discord')
  log.trace('sent message', toStr(sentMessage, 1))

  return sentMessage
}
