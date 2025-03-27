const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "tiktok",
    description: "Download and send a TikTok video without watermark",
    nashPrefix: false,
    version: "1.0.0",
    cooldowns: 5,
    aliases: ["tt", "tiktokdl"],
    usage: "[query]",
    example: "tiktok Mobile Legends gameplay",
    category: "Downloader",
    execute: async (api, event, args, prefix) => {
        const { threadID, messageID } = event;
        const query = args.join(" ");

        if (!query) {
            return api.sendMessage({
                body: `Please enter a search query. Example: \`${prefix}${module.exports.name} ${module.exports.example.split(" ").slice(1).join(" ")}\``
            }, threadID, messageID);
        }

        try {
            api.sendMessage({ body: "Searching for TikTok video, please wait..." }, threadID, messageID);

            const response = await axios.get(`https://zen-api.up.railway.app/api/tiktok?query=${encodeURIComponent(query)}`);
            const videoUrl = response.data.no_watermark;

            if (!videoUrl) {
                return api.sendMessage({ body: "Failed to get the video. Please try another query." }, threadID, messageID);
            }

            const videoPath = path.join(__dirname, "tiktok.mp4");
            const writer = fs.createWriteStream(videoPath);
            const videoStream = await axios.get(videoUrl, { responseType: "stream" });

            videoStream.data.pipe(writer);

            writer.on("finish", () => {
                api.sendMessage({
                    body: `${response.data.title}`,
                    attachment: fs.createReadStream(videoPath)
                }, threadID, () => fs.unlinkSync(videoPath), messageID);
            });

        } catch (error) {
            console.error("Error fetching TikTok video:", error);
            api.sendMessage({ body: `Failed to download video. Please try again later.\n\nError: ${error.message}` }, threadID, messageID);
        }
    },
};
