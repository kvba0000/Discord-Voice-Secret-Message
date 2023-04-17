import { existsSync } from "fs";
import config from "./config.js";
import {fileURLToPath} from 'url';
import {basename} from 'path'
import { checkToken, promptQ, checkChannel, encodeMessage, tryDecodeMessage, uploadFile, sendMessage, colors, wait, checkMessage } from "./helper.js";

/**
 * Main function
 */
const main = async () => {

    let missingFiles = []; // Check if needed files are missing
    if(["./config.js", "./file.mp3"].some(file => {
        const notExisting = !existsSync(file)
        if(notExisting) missingFiles.push(file);
        return notExisting;
    })) return console.log(`${colors.fg.red}[-] Missing files: ${missingFiles.join(", ")}, please check your files or re-download the project.${colors.reset}`);

    // Check if token is valid
    const [isValidToken, tokenData] = await checkToken(config.token);
    if(!isValidToken) return console.log(`${colors.fg.red}[-] Invalid token, set your token if you didn't yet.${colors.reset}`);

    if(process.argv.indexOf("--decode") != -1 && process.argv.indexOf("--link") != -1) {
        const link = process.argv[process.argv.indexOf("--link")+1];

        //check if link's regex matches: https://discord.com/channels/ID/ID/ID
        if(!link.match(/https:\/\/discord.com\/channels\/(\d{17,19}|@me)\/\d{17,19}\/\d{17,19}/)) return console.log(`${colors.fg.red}[-] Invalid link, please check your link.${colors.reset}`);

        // Get message from link and check if it's valid
        const [guildID, channelID, messageID] = link.split("/").slice(-3);
        const [isValidMsg, msgData] = await checkMessage(channelID, messageID);
        if(!isValidMsg) return console.log(`${colors.fg.red}[-] Invalid message, please check your link.${colors.reset}`);

        if(
            !msgData.attachments ||
            msgData.attachments.length == 0
        ) return console.log(`${colors.fg.red}[-] There's no hidden text in this message, please check your link.${colors.reset}`);

        // Try to decode message
        const attachment = msgData.attachments[0],
        waveform = attachment.waveform,
        decodedMessage = await tryDecodeMessage(waveform).catch(err => {
            console.log(`${colors.fg.red}[-] Error while decoding message, probably message doesn't contain any hidden text, please try again. \n`, err, colors.reset);
            return null;
        });

        if(decodedMessage == null) return;

        console.log([
            `${colors.fg.blue}[🌊] Message decoded successfully! Message:`,
            colors.bright + decodedMessage + colors.reset
        ].join("\n"));

        await wait(5000);

        return;
    }

    // Providing channel ID
    let channelID = "", channelData = null, validChannel = false;
    if(process.argv.indexOf("--channelID") != -1){
        channelID = process.argv[process.argv.indexOf("--channelID")+1]
    }
    while(!validChannel) {
        if(channelID == "") {
            console.log([
                `\n\n${colors.bg.blue}[🌊] Welcome ${tokenData.username}#${tokenData.discriminator} (${tokenData.id})${colors.reset}`,
                `${colors.fg.blue}[🌊] Which channel you want to send the message? (ID)`
            ].join("\n"))
            channelID = await promptQ("[🌊] Channel ID: ");
        }

        const [isValidChannel, channel] = await checkChannel(channelID); // Check if channel is valid
        if(!isValidChannel) {
            console.log(`${colors.fg.red}[-] Invalid channel, please try again.${colors.reset}\n`);
            channelID = "";
        }
        else validChannel = true, channelData = channel;
    }

    // Providing message
    let message = "", convertedMessage = [], validMessage = false;
    if(process.argv.indexOf("--message") != -1){
        // pass message in " " if it contains spaces
        let messageIndex = process.argv.indexOf("--message")+1;
        while(process.argv[messageIndex] && !process.argv[messageIndex].startsWith("--")) {
            message += process.argv[messageIndex] + " ";
            messageIndex++;
        }
    }
    while(!validMessage) {
        if(message == "") {
            console.log([
                `\n\n${colors.fg.blue}[🌊] Enter the message you want to send.`,
                `[🌊] REMEMBER: The message will be converted to hex and then to base64, so final length might be different.`,
            ].join("\n"))
            message = await promptQ("[🌊] Message: ");
        }
        convertedMessage = encodeMessage(message);
        // Check if message is too long
        // No need to check for more as message will be stored in hex
        if(convertedMessage[1] > 400) {
            console.log(`${colors.fg.red}[-] Message is too long, please try again.\n`);
            message = "";
        }
        else validMessage = true;
    }


    // Some message info for user [not needed but helpful]
    console.log(`\n\n${colors.dim}MSG: ${message}\nHEX: ${convertedMessage[0].match(/.{1,2}/g).join(" ")}\nBASE64: ${convertedMessage[1]}${colors.reset}`)

    // Uploading file
    console.log(`\n\n${colors.fg.yellow}[?] Uploading file to channel ${channelData.name} (${channelData.id})...`);
    const filename = await uploadFile("./file.mp3", channelID).catch(err => {
        console.log(`${colors.fg.red}[-] Error while uploading file, please try again.`);
        console.log(err);
    });

    // Sending final message
    console.log(`\n\n[?] File uploaded, filename: ${filename}, sending message...`);
    const data = {
        flags: 8192, // 8192 is a voice message
        attachments: [
            {
                id: "0",
                description: "",
                filename: "file.mp3",
                uploaded_filename: filename,
                duration_secs: config.audioLengthSeconds,
                waveform: convertedMessage[1],
                content_type: "audio/mpeg",
            }
        ]
    }
    const [isSent, sentData] = await sendMessage(channelID, data);
    if(!isSent) {
        console.log(`${colors.fg.red}[-] Error while sending message, please try again.`);
        return console.log(sentData);
    }


    console.log(`\n\n${colors.fg.green}[✅] Message sent, message ID: ${sentData.id}`);
    await wait(1000);

}

// Check if the script is being run directly
;(() => {
    const modulePath = fileURLToPath(import.meta.url);
    if (process.argv[1] === modulePath) {
        return main();
    }
    console.log(`This script (${basename(modulePath)}) is being imported from another module, please run it directly.`);
})();