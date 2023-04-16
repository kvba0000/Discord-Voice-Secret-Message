# 🌊 Voice Secret Mesage
###### ⚠️ TESTED ON WINDOWS 11, BUT SHOULD WORK ON OTHER OS
## ⚠️ WARNING
<b>THIS SCRIPT IS NOT MEANT TO BE USED FOR MALICIOUS PURPOSES, I AM NOT RESPONSIBLE FOR ANYTHING YOU DO WITH THIS SCRIPT.</b>
(also I haven't implemented decoding message created from this script, so you can't decode message yet, but it should be in near future)
## ❓ What's this?
Voice Secret Mesage is example of a script for Discord that allows you to send messages secretly without inexperienced people to notice it.  
## ❓ How does it work?
It uses new feature on discord called Voice Messages, basically what it does is sends audio file that works as voice message (file.mp3) to discord servers and then sends message with this voice message, the catch is - the WAVEFORM you send is actually modified. Instead of sending audio's waveform it sends one with secret message encoded to format that discord can understand.  
## 📺 Preview
<video src='preview.mp4' width=400></video>
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
| -start |  | Starts the script, if no argument below provided, script will ask you in fly. | -start |  |
|  | --channelID | ID of a channel you want to send message to | -start --channelID 123456789 | ❌ |
|  | --message | Message you want to send | -start --message "Hello World" | ❌ |
| -config |  | Starts configuration script | -config |  |

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

## ⚠️ Issues
<b>If you have any issues with the script, please create an issue on GitHub.</b>

## 🧑‍💻 More technical stuff
### 📝 How is waveform stored?
Waveform is just a base64 encoded hex which includes how high and low the sound is at certain time. This way I can put any data I want into it and it will be sent as a voice message's waveform. (I'm not going to explain how I did it, because it's not that important, but if you want to know, you can ask me on dm's, links are on my profile)
### 📝 How is message encoded?
To make message less obvious I encoded message the way the waveform is stored but at the beginning of it I put empty space (0x00) so it will show up as empty space in waveform, I'm planning to add more encodings/obfuscation in the future.