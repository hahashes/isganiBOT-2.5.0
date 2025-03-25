const fs = require("fs");

module.exports = {
    name: "zen",
    description: "Promote Zen AI Ultra+++ PRO PageBot",
    nashPrefix: false,
    version: "1.0.0",
    cooldowns: 10,
    aliases: ["pagebot", "zenpromo"],
    usage: "",
    category: "AI",
    execute: async (api, event) => {
        const { threadID, messageID } = event;

        const promoMessage = `😵 𝙉𝙚𝙬 𝙐𝙥𝙙𝙖𝙩𝙚: Zen AI Ultra+++ PRO PageBot is Here! 😵

We’re excited to announce that Zen AI Ultra+++ PRO now has its own PageBot! 😍

💡 What is the purpose of PageBot?
The PageBot is designed for users who might not have mobile data or Wi-Fi. Instead of relying on the website, you can now interact with Zen AI directly on this page, ensuring you can always get answers or essays.👌

🔧 Why Use PageBot?
✅ No Load, No Problem – Chat with Zen AI even without mobile data or Wi-Fi. 📱❌  
✅ Instant Access – Get help and generate essays without worrying about internet connectivity.  
✅ It’s Zen AI at your fingertips, making it easier for you to stay connected no matter where you are! 🧑‍💻💬  

📌 Page Link:  
🔹 [Zen AI Ultra+++ PRO PageBot] https://www.facebook.com/profile.php?id=61574066434198&mibextid=ZbWKwL\n\n🔹 [Zen AI Ultra+++ PRO website] https://zen-ai.up.railway.app`;

        const imagePaths = ["promote/zen.jpg", "promote/zen2.jpg"];
        const attachments = imagePaths.map(path => fs.createReadStream(path));

        api.sendMessage({ body: promoMessage, attachment: attachments }, threadID, messageID);
    },
};
