import axios from "axios";
import { readFileSync } from "fs";
import {createInterface} from "readline";




/*

    @ NOTES:

    x-super-properties is a header with base64 encoded data that discord uses to track
    your device, browser, etc. in this case, we're using dummy data, that does not
    contain any personal information for privacy measures.

    it contains client_build_number, i don't know if it changes,
    so if you're having error when sending message, try to change it
    to the latest one.

*/





let validToken = false, token = null;
const splitter = '21133712'

/**
 * 
 * @param {string} t Token to check if it's valid 
 * @returns 
 */
export const checkToken = async (t) => {
    const url = 'https://discord.com/api/v9/users/@me',
        headers = {
            'Authorization': t
        },
        resp = await axios.get(url, { headers }).catch(err => err.response);

    validToken = resp.status === 200, token = t;

    return [resp.status === 200, resp.data];
}

/**
 *  Asynchronous wait function
 * @param {number} ms Time to wait in milliseconds 
 * @returns 
 */
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 *  Generates random number between min and max
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
export const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

/**
 *  Checks if the channel exists
 * @param {string} channelID Channel ID to check if it's valid/exists 
 * @returns {[boolean, any]} Returns [if succeded, data]
 */
export const checkChannel = async (channelID) => {
    if(!validToken) throw new Error("Invalid token, check your config.js file.");
    const url = `https://discord.com/api/v9/channels/${channelID}`,
        headers = {
            'Authorization': token
        },
        resp = await axios.get(url, { headers }).catch(err => err.response);

    return [resp.status === 200, resp.data];
}

/**
 *  Checks if the message exists in the channel
 * 
 *  Credits to discord.js-selfbot-v13 package creator for message fetch function
 *  https://github.com/aiko-chan-ai/discord.js-selfbot-v13/blob/9c9f573dc102db3c0a4adbc2e5f678b0c2bab36d/src/managers/MessageManager.js#L273
 * 
 * @param {string|number} channelID  Channel ID of message
 * @param {string|number} messageID  ID of message to check
 * @returns {[boolean, any]} Returns [if succeded, data]
 */
export const checkMessage = async (channelID, messageID) => {
    if(!validToken) throw new Error("Invalid token, check your config.js file.");
    const url = `https://discord.com/api/v9/channels/${channelID}/messages?around=${messageID}&limit=1`,
        headers = {
            'Authorization': token
        },
        resp = await axios.get(url, { headers }).catch(err => err.response);

    if(resp.status === 200) {
        const msg = resp.data.find(e => e.id == messageID)
        if(!msg) return [false, null];
        return [true, msg];
    }

    return [false, resp.data];
}

/**
 * Generates a random hex string with the given size
 * @param {number} size  Size of the hex string to generate
 * @returns 
 */
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

/**
 * 
 * @param {string} question  Question to ask to the user
 * @returns 
 */
export const promptQ = (question) => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => rl.question(question, ans => {
        rl.close();
        resolve(ans);
    }))
}


/**
 * 
 * @param {string} message Message to encode to waveString 
 * @returns 
 */
export const encodeMessage = (message) => {
    const hexed = genRanHex(randomNumber(10,30)).replace(new RegExp(splitter, 'g'), genRanHex(splitter.length)) + splitter + Buffer.from(message, 'utf-8').toString("hex").match(/.{1,2}/g).reverse().join('') + splitter + genRanHex(30).replace(new RegExp(splitter, 'g'), genRanHex(randomNumber(10,30))),
        base64 = Buffer.from(hexed, "hex").toString("base64");
        
    return [hexed, base64];
}


/**
 * 
 * @param {string} waveformBase64 Base64 encoded waveform hex string 
 */
export const tryDecodeMessage = async (waveformBase64) => {
    return new Promise((resolve, reject) => {
        try {
            const hexed = Buffer.from(waveformBase64, "base64").toString("hex"),
                message = Buffer.from(hexed.split(splitter)[1].match(/.{1,2}/g).reverse().join(''), "hex").toString("utf-8");
            resolve(message);
        } catch (error) {
            reject(error);
        }
    })
}

/**
 * 
 * @param {string} channelID Channel ID to send the message to
 * @param {any} data  Data to send to the channel
 * @returns 
 */
export const sendMessage = async (channelID, data) => {
    if(!validToken) throw new Error("Invalid token, check your config.js file.");
    const url = `https://discord.com/api/v9/channels/${channelID}/messages`,
        headers = {
            'Authorization': token,
            "x-super-properties": "eyJvcyI6IiIsImJyb3dzZXIiOiIiLCJkZXZpY2UiOiIiLCJzeXN0ZW1fbG9jYWxlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiIiwiYnJvd3Nlcl92ZXJzaW9uIjoiIiwib3NfdmVyc2lvbiI6IiIsInJlZmVycmVyIjoiIiwicmVmZXJyaW5nX2RvbWFpbiI6IiIsInJlZmVycmVyX2N1cnJlbnQiOiIiLCJyZWZlcnJpbmdfZG9tYWluX2N1cnJlbnQiOiIiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoxODk2MTcsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGwsImRlc2lnbl9pZCI6MH0="
        },
        resp = await axios.post(url, data, { headers }).catch(err => err.response);

    return [resp.status === 200, resp.data];
}

/**
 * 
 * @param {string} filePath  Path to the file to upload
 * @param {string} channelID  Channel ID to upload the file to
 * @returns 
 */
export const uploadFile = async (filePath, channelID) => {
    if(!validToken) throw new Error("Invalid token, check your config.js file.");
    const url = `https://discord.com/api/v9/channels/${channelID}/attachments`,
        headers = {
            'Authorization': token,
        },
        data = {
            files: [{
                filename: filePath.split("/").pop(),
                file_size: 1337,
                id: 16
            }]
        },
        uploadData = await axios.post(url, data, { headers }).catch(err => err.response);

        if(uploadData.status !== 200) throw new Error("Error preparing file, please try again.", uploadData.data);

        const uploadResp = await axios.put(uploadData.data.attachments[0].upload_url, readFileSync(filePath), { headers: { 'Content-Type': 'audio/mpeg' } }).catch(err => err.response);

        if(uploadResp.status !== 200) throw new Error("Error uploading file, please try again.", uploadResp.data);

        return uploadData.data.attachments[0].upload_filename;
}


export const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
        crimson: "\x1b[38m" // Scarlet
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        gray: "\x1b[100m",
        crimson: "\x1b[48m"
    }
};