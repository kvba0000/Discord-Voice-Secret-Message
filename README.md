# 🌊 Voice Secret Message
###### ⚠️ TESTED ON WINDOWS 11, BUT SHOULD WORK ON OTHER OS
# 🛑 I'M NOT ADDING FEATURES FOR THIS PROJECT
As I don't have much time I can't put more features to this project as well as some other ones. I'll try to keep it working as long as it is physically possible though.  
Pull requests and Bug reports are welcome!
## ⚠️ WARNING
<b>THIS SCRIPT IS NOT MEANT TO BE USED FOR MALICIOUS PURPOSES, I AM NOT RESPONSIBLE FOR ANYTHING YOU DO WITH THIS SCRIPT.</b>
## ❓ What's this?
Voice Secret Mesage is example of a script for Discord that allows you to send messages secretly without inexperienced people to notice it.  
## ❓ How does it work?
It uses new feature on discord called Voice Messages, basically what it does is sends audio file that works as voice message (file.mp3) to discord servers and then sends message with this voice message, the catch is - the WAVEFORM you send is actually modified. Instead of sending audio's waveform it sends one with secret message encoded to format that discord can understand.  
## 📺 Preview

https://user-images.githubusercontent.com/47297843/232315204-29cb1cb6-e741-4a2e-96e5-e227125da408.mp4

## ▶️ How to use it?
1. Download/clone the script
2. Install requirements
```cmd
npm install
```
3. Run the script
```cmd
node voice [arguments]
```
4. Follow the instructions provided by the script
## 📝 Arguments
| Argument | Subargument | Description | Example | Required |
| -------- | ----------- | ----------- | ------- | -------- |
| -start |  | Starts the script, if no argument below provided, script will ask you in fly. <b>(defaults to encode mode)</b> | `-start` |  |
|  | --channelID | ID of a channel you want to send message to <b>(ommited in decode mode)</b> | `-start --channelID 123456789` | ❌ |
|  | --message | Message you want to send <b>(ommited in decode mode)</b> | `-start --message Hello World` | ❌ |
| | --decode | Turns on decode mode, stays in encode mode if didn't provide required arguments | `-start --decode [args]` | ❌ |
| | --link | Link of a voice message you want to decode | `-start --decode --link https://discord.com/channels/123456789/123456789/123456789` | <b>(only in decode mode)</b> |
| -config |  | Starts configuration script | `-config` |  |

## 📝 Configuration
This section is for people who want to configure the script without using script (which is not recommended).
#### 📝 Config.json
| Key | Description | Example | Default |
| --- | ----------- | ------- | ------- |
| token | Discord token you'll use to send message <b>USE ONLY YOUR TOKEN</b> | "token": "xxxxxxx" | |
| audioLengthSeconds | Length of audio you'll send (seconds) <b>MIN: 0, MAX: 2147483647</b> | "audioLengthSeconds": 5 | 5 |

## 📝 FAQ
### ❓ How to get my Discord token?
1. Open Discord
2. Press CTRL + SHIFT + I
3. Go to Network tab
4. Press F5
5. Go to Headers tab
6. Copy value of Authorization
### ❓ How to get my Discord channel ID?
1. Enable developer mode in Discord settings
2. Right click on channel you want to send message to
3. Click Copy ID
### ❓ Can I use your project in my project?
Yes, you can use this project in your bot/project, but you have to credit me and link to this repository. It would mean a lot to me.

## 📰 Credits
- [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13/):
    - [message fetching function](https://github.com/aiko-chan-ai/discord.js-selfbot-v13/blob/9c9f573dc102db3c0a4adbc2e5f678b0c2bab36d/src/managers/MessageManager.js#L273)

## ⚠️ Issues
<b>If you have any issues with the script, please create an issue on GitHub.</b>

## 🧑‍💻 More technical stuff
### 📝 How is waveform stored?
Waveform is just a base64 encoded hex which includes how high and low the sound is at certain time. This way I can put any data I want into it and it will be sent as a voice message's waveform. (I'm not going to explain how I did it, because it's not that important, but if you want to know, you can ask me on dm's, links are on my profile)
### 📝 How is message encoded?
To make message less obvious I encoded message the way the waveform is stored but at the beginning and ending of it I put random data, message itself before being turn into base64 is hex reversed which makes every bit of data moved to the respecive place at the end, example: `00 11 22` turns into `22 11 00`, I'm planning to add more encodings/obfuscation in the future.
<b>⚠️ Messages encoded with different script versions might not be decoded properly (due to changing obfuscation methods), always remember to check if you have correct version!</b>
