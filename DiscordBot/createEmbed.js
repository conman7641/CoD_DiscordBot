const { EmbedBuilder } = require("discord.js")
const Discord = require("discord.js");

function createEmbedMP(gamertag, game, kd, kills, deaths, client) {
    return new EmbedBuilder()
        .setTitle(`Call of Duty ${game} Stats`)
        .setDescription(`Here are ${gamertag} stats`)
        .setColor(0x18e1ee)
        .setImage(client)
        .setURL(`https://www.youtube.com/user/conman7641`)
        .setTimestamp(Date.now())
        .addFields([
            {
                name: 'kills',
                value: kills,
                inline: true
            },
            {
                name: 'deaths',
                value: deaths,
                inline: true
            },
            {
                name: 'kd',
                value: kd,
                inline: true
            }]
        );
}

function createEmbedWarzone(data, gamertag, platform, client) {
    return new Discord.EmbedBuilder()
        .setTitle(`${gamertag}'s Warzone Stats`)
        .setDescription(`Platform: ${platform}`)
        .setColor(0x00AE86)
        .setImage(client)
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
}

module.exports = createEmbedMP
module.exports = createEmbedWarzone