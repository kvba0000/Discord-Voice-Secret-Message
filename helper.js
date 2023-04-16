import axios from "axios";
import { readFileSync } from "fs";
import {createInterface} from "readline";
import {fileURLToPath} from 'node:url';



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
 * 
 * @param {number} ms Time to wait in milliseconds 
 * @returns 
 */
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


/**
 * 
 * @param {string} channelID Channel ID to check if it's valid/exists 
 * @returns 
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
    const hexed = new Uint8Array(Array(200).fill(0x00)).join("") + Buffer.from(message, 'utf-8').toString("hex"),
        base64 = Buffer.from(hexed, "hex").toString("base64");
        
    return [hexed, base64];
}

/**
 * 
 * @param {string} waveformBase64 Base64 encoded waveform hex string 
 */
export const decodeMessage = (waveformBase64) => {
    throw new Error("Not implemented yet.");
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