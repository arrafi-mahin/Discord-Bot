const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Bot description and all Commands'),
    async execute(interaction) {
        await interaction.reply('Help command is under construction. be patient.!');
    },
};