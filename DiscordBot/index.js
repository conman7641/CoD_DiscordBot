
/*
login(ssoToken: string);
// or alternatively
import API from "call-of-duty-api";
API.login(ssoToken: string);
*/
const ModernWarfare = require("call-of-duty-api")
const Me = require("call-of-duty-api")
const Discord = require("discord.js")
const Platform = require("call-of-duty-api")
const Store = require("call-of-duty-api")
const { EmbedBuilder } = require("discord.js")
const {platforms} = require("call-of-duty-api");
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

const userID = "424736619266834432"
const testID = '631345478637977611'

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
    const platform = args[2].toLowerCase()
    const gamertag = args[1].toString()

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

    const embed = new Discord.EmbedBuilder()
        .setTitle(`${gamertag}'s Warzone Stats`)
        .setDescription(`Platform: ${platform}`)
        .setColor(0x00AE86)
        .setImage(client.user.displayAvatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp(Date.now())
        .setURL(`https://www.youtube.com/user/conman7641`)
        .addFields([
            {
                name: 'Kills',
                value: data.data.lifetime.mode.br_all.properties.kills.toString(),
                inline: true
            },
            {
                name: 'Deaths',
                value: data.data.lifetime.mode.br_all.properties.deaths.toString(),
                inline: true
            },
            {
                name: 'K/D',
                value: data.data.lifetime.mode.br_all.properties.kdRatio.toFixed(2).toString(),
                inline: true
            },
            {
                name: 'Wins',
                value: data.data.lifetime.mode.br_all.properties.wins.toString(),
                inline: true
            },
            {
                name: 'Top 5',
                value: data.data.lifetime.mode.br_all.properties.topFive.toString(),
                inline: true
            },
            {
                name: 'Top 10',
                value: data.data.lifetime.mode.br_all.properties.topTen.toString(),
                inline: true
            },
            {
                name: 'Games Played',
                value: data.data.lifetime.mode.br_all.properties.gamesPlayed.toString(),
                inline: true
            },
            {
                name: 'Total Score',
                value: data.data.lifetime.mode.br_all.properties.score.toString(),
                inline: true
            }]
        );
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
    console.log(data.data)
    const embed = new EmbedBuilder()
        .setTitle(`Call of Duty ${game} Stats`)
        .setDescription(`Here are ${gamertag} stats`)
        .setColor(0x18e1ee)
        .setImage(client.user.displayAvatarURL())
        .setURL(`https://www.youtube.com/user/conman7641`)
        .setTimestamp(Date.now())
        .addFields([
            {
                name: 'kills',
                value: data.data.lifetime.all.properties.kills.toString(),
                inline: true
            },
            {
                name: 'deaths',
                value: data.data.lifetime.all.properties.deaths.toString(),
                inline: true
            },
            {
                name: 'kd',
                value: data.data.lifetime.all.properties[kdString].toFixed(2).toString(),
                inline: true
            }]
        );
    message.channel.send({ embeds: [embed] })

})



ModernWarfare.login(codToken)

client.login(token)

