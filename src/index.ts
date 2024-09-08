import { DiscordClientConfig } from './config/DiscordClientConfig'
import { createWinstonLogger } from './createWinstonLogger'
import { Client, Events, Presence, TextChannel, type Guild } from 'discord.js'
import 'dotenv/config'
import process from 'node:process'

const winstonLogger = createWinstonLogger('index')

process.on('unhandledRejection', (reason, promise) => {
  winstonLogger.error('[UNHANDLED REJECTION ERROR]', promise, 'reason:', reason)
})

const client = new Client(DiscordClientConfig)


client.on(Events.PresenceUpdate, async (oldStatus: Presence | null, newStatus: Presence) => {

  const refoldJpBotId = '1176598712567480461'
  if (newStatus?.user?.id !== refoldJpBotId) return

  const refoldJpGuild = client.guilds.cache.find(guild => guild.id === '778787713012727809')

  const bot = await refoldJpGuild?.members.fetch(refoldJpBotId)

  const sendMessage = async (content: string) => {
    const channel = await refoldJpGuild?.channels.fetch('1219720412741636199')
    await (channel as TextChannel).send({ content })
  }

  const timestamp = `<t:${Math.floor(Date.now() / 1000)}:R>`

  if (oldStatus?.status === 'offline' && newStatus.status === 'online') {
    await sendMessage(`🌍 The ${bot!!.user.username} came back online ${timestamp}`)
  } 
  if (oldStatus?.status !== 'offline' && newStatus.status === 'offline') {
    const sparklesId = '137685703147388928'
    const tylerId =  '202639251865731072'
    await sendMessage(`⚠️ Looks like the ${bot?.user.username} went offline ${timestamp} <@${tylerId}> <@${sparklesId}>`)
  }
})


async function main(): Promise<void> {
  try {
    winstonLogger.info('Started refreshing application (/) commands.')
    await client.login(process.env.DISCORD_BOT_TOKEN)
  } catch (error) {
    winstonLogger.error(`[MAIN() ERROR]: ${error as string}`)
  }
}

main()