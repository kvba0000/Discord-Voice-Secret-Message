import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { colors } from './helper.js';


/**
 * 
 * @param {string} arg  Argument to find
 * @returns Index of the argument
 */
const findArg = (arg) => args.indexOf(arg);
/**
 * 
 * @returns First argument that starts with "--"
 */
const findFirstArg = () => args.find(arg => Object.values(scripts).map(e => e.name).includes(arg));
/**
 * 
 * @param {string} scriptName Name of the script to run
 * @param {Array<string>} args Arguments to pass to the script as process.argv
 */
const runScript = async (scriptName, args) => {
    let p = spawn("node", [`${folderPath}/${scriptName}.js`, ...args], {stdio: ['inherit', 'inherit', 'pipe']}), errors = [];
    p.on("exit", (code) => {
        console.log('\n')
        console.log(`${'\n'.repeat(process.stdout.rows/5)}${colors.fg.green}Thanks for using this script!\n@kob.kuba${colors.reset}${'\n'.repeat(process.stdout.rows/2)}`.split('\n').map(e => e.padStart(process.stdout.columns / 2 + e.length / 2)).join('\n'));
        if(code != 0) {
            console.log(`${colors.bg.red}[-] An errors occurred while running the script:${colors.reset + colors.fg.red}\n`, errors.join(`\n${colors.dim}==================${colors.reset}${colors.fg.red}\n`), `${colors.reset+colors.bg.red}[-] Please report it on github issues page ASAP!`, colors.reset);
            process.exit(1);
        }
        process.exit(0)
    })
    p.stderr.on('data', (message) => {
        errors.push(Buffer.from(message).toString())
    })
};
/**
 * Shows help message
 */
const showHelp = () => {
    console.log(colors.fg.red + `${colors.dim}|${colors.reset}${colors.fg.red}${colors.bright} Available scripts:`);
    for(const script in scripts){
        console.log(`${colors.dim}|\n| \t${colors.reset}${colors.fg.red}${colors.bright} ${scripts[script].name} - ${scripts[script].description}`);
        if(scripts[script].args.length > 0){
            console.log(`${colors.dim}| \t | \t${colors.reset}${colors.fg.red}${colors.bright}Arguments:`);
            for(const arg of scripts[script].args){
                console.log(`${colors.dim}| \t | \t|${colors.reset}${colors.fg.red}${colors.bright} ${arg.name} - ${arg.description} ${arg.required ? "(required)" : ""}`);
            }
        }
    }
    console.log("\n" + colors.reset);
    process.exit(0);
};
const args = process.argv.slice(2), // remove unnecessary arguments
    thisPath = fileURLToPath(import.meta.url).replace(/\\/g, "/"), // get path to this file
    folderPath = thisPath.split("/").slice(0, -1).join("/"), // get path to the folder
    nodePath = process.argv[0].replace(/\\/g, "/"); // get path to node executable


/*

    DEFINE SCRIPTS HERE

*/
let scripts = {};

scripts.start = {
    name: "-start",
    description: "Runs the script",
    args: [
        {"name": "--channelID", "description": "The channel ID to send the message to", "required": false},
        {"name": "--message", "description": "The message to send", "required": false},
    ],
    run: () => {
        runScript("index", args);
    }
}

scripts.config = {
    name: "-config",
    description: "Configures the script",
    args: [],
    run: () => {
        runScript("configScript", args);
    }
}

/*

    END OF SCRIPTS

*/

// check if any script was specified
if(!findFirstArg()){
    console.log(`${colors.bg.red}[-] No script specified, please specify a script to run.${colors.reset}`);
    showHelp();
}

// check if the specified script is valid
const scriptName = findFirstArg();
const script = Object.entries(scripts).find(([key, value]) => value.name == scriptName);
if(!script) {
    console.log(`${colors.bg.red}[-] Invalid script specified, please specify a valid script to run. (Script: ${scriptName})${colors.reset}`);
    showHelp();
}

// run the script
script[1].run();