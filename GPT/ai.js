require('dotenv').config();
const OpenAi = require('openai');

const client = new OpenAi({apiKey: process.env.OPEN_AI_KEY});
const openAi = async (message)=>{
    console.log(message);
    try{

        const completion = await client.chat.completions.create({
            messages: [{ role: "system", content: message }],
            model: "gpt-3.5-turbo",
        });
        
        return completion.choices[0].message.content
    }catch(error){
        console.log(error);
    }
}

module.exports = openAi;