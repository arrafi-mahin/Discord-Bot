const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('This command will tell you jokes'),
    async execute(interaction) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://v2.jokeapi.dev/joke/any?type=single',
            headers: {}
        };
        let jokes;
      await  axios.request(config)
            .then((response) => {
                jokes = response.data.joke;
            })
            .catch((error) => {
                console.log(error);
            });
       if(jokes != "") await interaction.reply(jokes);
    },
};