const axios = require("axios");

module.exports = {
    name: "heckai",
    description: "Interact with HeckAI",
    nashPrefix: false,
    version: "1.0.0",
    cooldowns: 5,
    aliases: ["heck"],
    usage: "[question]",
    example: "heckai What is 2+2?",
    category: "AI",
    execute: async (api, event, args, prefix) => {
        const { threadID, messageID } = event;
        let question = args.join(" ");

        if (!question) {
            return api.sendMessage({
                body: `Please enter a question. Example: ${prefix}${module.exports.name} ${module.exports.example.split(" ").slice(1).join(" ")}`
            }, threadID, messageID);
        }

        try {
            const info = await api.sendMessage({ body: "[ HeckAI ]\n\nPlease wait..." }, threadID, messageID);
            const { data } = await axios.get(`https://zen-api.up.railway.app/api/heckai?question=${encodeURIComponent(question)}`);

            api.editMessage(data.answer || "No answer received.", info.messageID);
        } catch (error) {
            api.sendMessage({ body: `Failed to fetch data. Please try again later.\n\nError: ${error.message}` }, threadID, messageID);
        }
    },
};
