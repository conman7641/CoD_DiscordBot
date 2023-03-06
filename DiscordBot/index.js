
const ModernWarfare = require("call-of-duty-api")
const Me = require("call-of-duty-api")
const Discord = require("discord.js")
const Platform = require("call-of-duty-api")
const Store = require("call-of-duty-api")
const createEmbedMP = require("./createEmbed");
const createEmbedWarzone = require("./createEmbed");
const token = ""
const client = new Discord.Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "MessageContent",
        "GuildMembers",

    ]
})
const codToken = ""
const prefix = ".c ";

client.on("ready", () => {
    console.log(`logged in as ${client.user.tag}`)
})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split()
    if (args[0] === 'ping') {
        await message.reply("pong")
    }
})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(' ')
    if (args.length !== 4) return
    if (args[0] !== 'recent') {
        return;
    }
    const game = args[1]
    const gamertag = args[2].toString()
    const platform = args[3].toString()
    try {
        let data = await ModernWarfare[game].combatHistory(gamertag, platform)
        //data = JSON.stringify(data, null, 2).substring(0, 1700)
        for (data.data.matches of data.data.matches) {
            console.log(data.data.matches)
        }
        //message.reply(`Your recent stats are: ${data}`)
    } catch (e) {
        console.log(e)
    }
})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(' ')

    if (args.length !== 3) return;

    const game = args[0].toString()
    const gamertag = args[1].toString()
    const platform = args[2].toLowerCase()

    if (game !== 'Warzone') return;
    if (platform !== 'psn' && platform !== 'xbl' && platform !== 'battle') return;

    const data = await ModernWarfare[game].fullData(gamertag, platform)

    //Make sure error is not thrown by account not being found
    if (data.status === "error" && data.data.message.includes('not allowed')) {
        await message.reply("Private account")
        return;
    } else if (data.status === "success" && data.data.lifetime.all.properties === null) {
        await message.reply("Person did not play game")
        return;
    }


    const embed = createEmbedWarzone(data, gamertag, platform, message.author.displayAvatarURL())
    message.channel.send({ embeds: [embed] })

})

client.on("messageCreate", async (message) => {
    //simple command handler
    if (message.author.bot) return; //dont message a bot
    if (!message.content.startsWith(prefix)) return; //if the message doesn't start with the prefix, don't do anything
    const args = message.content.slice(prefix.length).split( ' ')
    if (args.length !== 3) {
        return; //if the message doesn't have 3 arguments, don't do anything
    }
    const game = args[0].toString()
    if (game === 'Warzone') {
        return  //Putting warzone method in a different event since getting that stats is different
    }
    let kdString = ""
    const platform = args[2].toLowerCase()
    const gamertag = args[1].toString()

    if (platform !== "psn" && platform !== "xbl" && platform !== "battle") {
        return;
    }
    const data = await ModernWarfare[game].fullData(gamertag, platform);

    //Error checking to not break bot if account is private or person did not play the game
    if (data.status === "error" && data.data.message.includes('not allowed')) {
        await message.reply("Private account")
        return;
    } else if (data.status === "success" && data.data.lifetime.all.properties === null) {
        await message.reply("Person did not play game")
        return;
    } else if (data.status === "error" && data.data.message.includes('not found')) {
        await message.reply("User not found")
        return;
    }

    if (game === "ColdWar") {
        kdString = "kdratio"
    } else {
        kdString = "kdRatio"
    }

    const kd = data.data.lifetime.all.properties[kdString].toFixed(2).toString()
    const kills = data.data.lifetime.all.properties.kills.toString()
    const deaths = data.data.lifetime.all.properties.deaths.toString()
    const embed = createEmbedMP(gamertag, game, kd, kills, deaths, message.author.displayAvatarURL())
    message.channel.send({ embeds: [embed] })

})

ModernWarfare.login(codToken)

client.login(token)