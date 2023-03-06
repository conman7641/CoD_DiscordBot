const { EmbedBuilder } = require("discord.js")

function createEmbed(gamertag, game, kd, kills, deaths, client) {
    return new EmbedBuilder()
        .setTitle(`Call of Duty ${game} Stats`)
        .setDescription(`Here are ${gamertag} stats`)
        .setColor(0x18e1ee)
        .setImage(client.displayAvatarURL())
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

module.exports = createEmbed;