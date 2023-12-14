const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greetings')
        .setDescription('Get Greetings'),
    async execute(interaction) {
        await interaction.reply('Hello There!');
    },
};