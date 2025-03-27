const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "pinterest",
    description: "Search for Pinterest images",
    nashPrefix: false,
    version: "1.0.2",
    cooldowns: 5,
    aliases: ["pin", "pint"],
    usage: "[query]",
    example: "pinterest Love",
    category: "Search",
    execute: async (api, event, args, prefix) => {
        const { threadID, messageID } = event;
        const query = args.join(" ");

        if (!query) {
            return api.sendMessage({
                body: `❌ Please enter a search query.\nExample: \`${prefix}${module.exports.name} ${module.exports.example.split(" ").slice(1).join(" ")}\``
            }, threadID, messageID);
        }

        try {
            api.sendMessage({ body: "🔍 Searching Pinterest, please wait..." }, threadID, (err, info) => {
                if (err) return;
                
                setTimeout(() => {
                    api.unsendMessage(info.messageID);
                }, 3000);
            });

            const response = await axios.get(`https://kaiz-apis.gleeze.com/api/pinterest?search=${encodeURIComponent(query)}`);
            const images = response.data.data;

            if (!images || images.length === 0) {
                return api.sendMessage({ body: "❌ No results found. Try another search query." }, threadID, messageID);
            }

            const imageFolder = path.join(__dirname, "commands/pinterest");
            if (!fs.existsSync(imageFolder)) fs.mkdirSync(imageFolder, { recursive: true });

            const downloadedImages = [];
            for (let i = 0; i < Math.min(images.length, 20); i++) {
                const imageURL = images[i];
                const imagePath = path.join(imageFolder, `pinterest_${i}.jpg`);

                const imageResponse = await axios.get(imageURL, { responseType: "arraybuffer" });
                fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, "binary"));

                downloadedImages.push(fs.createReadStream(imagePath));
            }

            api.sendMessage({
                body: "📸 Here are your Pinterest images:",
                attachment: downloadedImages
            }, threadID, () => {
                setTimeout(() => {
                    downloadedImages.forEach(stream => fs.unlinkSync(stream.path));
                }, 5000);
            });

        } catch (error) {
            api.sendMessage({ body: `❌ Failed to search images. Please try again later.\n\nError: ${error.message}` }, threadID, messageID);
        }
    },
};
