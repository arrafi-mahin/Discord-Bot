// Require the necessary discord.js classes
const { Client, Events, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config();
const General = require('./General/General');
const openAi = require('./GPT/ai');
const fs = require('node:fs');
const path = require('node:path');
const token = process.env.BOT_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();

const commands = []

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON())
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
    try {
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

// client.on('messageCreate', async (message) => {
//     // Getting Attachment and Transfer to NFT
//     if(message.author == '1006042846664597534' && message.content === 'NFT' && message.attachments.size != 0){
//         console.log('NFT Uploaded');
//         return nft(message);
//     }
    
//     // Ignoring Bot messages
//     if (message.author.bot) {
//         return;
//     } else {    
//         const name = message.author.globalName;
//         const msg = message.content;
//         if (msg.toLowerCase() === "hi") {
//             return message.reply(`Hello ${name}!!!`)
//         }
//         else if (msg.toLowerCase().includes("panda")) {
//             try {
//                 const replay = General(msg.toLowerCase());
//                 return message.reply(replay);
//             } catch (error) {
//                 console.log(error)
//             }
//         } 
//         else if(msg.toLowerCase().startsWith('ask',0)){
//             console.log("aksed");
//             const replay = await openAi(msg.slice(4));
//             console.log(replay);
//             return message.reply(replay);
//         }
//     }
// })

client.login(token);

