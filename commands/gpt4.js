const axios = require("axios");

module.exports = {
    name: "gpt4",
    description: "Interact with GPT-4",
    nashPrefix: false,
    version: "1.0.0",
    cooldowns: 5,
    aliases: ["ai"],
    usage: "[prompt]",
    example: "gpt4 what is the capital of France?",
    execute: async (api, event, args, prefix) => {
        const { threadID, messageID, senderID } = event;
        let prompt = args.join(" ");

        if (!prompt) {
            return api.sendMessage({
                body: `Please enter a prompt. Example: ${prefix}${module.exports.name} ${module.exports.example.split(" ").slice(1).join(" ")}`
            }, threadID, messageID);
        }

        try {
            const info = await api.sendMessage({ body: "[ GPT-4 ]\n\nPlease wait..." }, threadID, messageID);
            const { data } = await axios.get(`https://zen-api.up.railway.app/api/gpt4?prompt=${encodeURIComponent(prompt)}&uid=${senderID}`);

            let reply = data.message === "Conversation cleared." ? "✅ Conversation has been cleared." : data.response || "No response received.";
            api.editMessage(reply, info.messageID);
        } catch (error) {
            api.sendMessage({ body: `Failed to fetch data. Please try again later.\n\nError: ${error.message}` }, threadID, messageID);
        }
    },
};
