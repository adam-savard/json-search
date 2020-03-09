const yargs = require('yargs');
const fs = require('fs');
var json = {};
var keyValue;
var debugMode = false;
//declarartion of options to be used

const options = yargs
    .usage("Usage: -f <filename> -k <key> <options>")
    .option("f", {
        alias: "file",
        describe: "The file to be used as input",
        type: "string",
        default: null
    })
    .option("k", {
        alias: "key",
        describe: "The key to display. If blank, returns entire JSON object.",
        type: "string",
        default: "",
        demandOption: true
    })
    .option("s", {
        alias: "get-size",
        describe: "Get the size of the key given",
        type: "boolean",
        default: false,
        requiresArg: false
    })
    .option("l", {
        alias: "get-length",
        describe: "Gets the length of the array, given the key's value is an array.",
        type: "boolean",
        default: false,
        requiresArg: false
    })
    .option("o", {
        alias: "output",
        describe: "Sets whether the key provided should be logged or not.",
        type: "boolean",
        default: true
    })
    .option("no-key-value", {
        alias: "no-key-value",
        describe: "Equivalent to -o false",
        type: "boolean",
        default: false,
        requiresArg: false
    })
    .argv;
/**
 * Processes all of the argv options in turn, starting with the file. Goes by a preset list of commands.
 */
const processArgs = async function () {
    if (options["no-key-value"]) options.o = false;
    if (!options.i && !options.f == "") {
        readFile();
    } else{
        console.error("Piping commands to json-search is not supported. You can pipe from it, though! :)");
    }
}

/**
 * Reads the file given from the terminal (if any) and stores it in a const called json
 */
const readFile = async function () {
    if (options.f == "") {
        //use stdin
        console.error(`You supplied a blank file. Did you mean -stdin for reading from standard input?`);
    } else {
        //read the file from disk
        let asyncFileRead = async _ => {
            fs.readFile(options.f, {
                encoding: 'utf-8'
            }, function (err, data) {
                if (err) {
                    console.error(`No such file: ${options.f}`);
                } else {
                    json = JSON.parse(data);
                    processJson();
                }
            });
        }

        await asyncFileRead();
    }

}

const processJson = function () {
    getKey();
    getSize();
    getLength();
    getOutput();
}

/**
 * Gets the key from the JSON, and stores it. The key is logged out by default
 */
const getKey = function () {
    debugLog(options.k);
    if (options.k == "") {
        //if there's no key provided, just log the whole thing back out
        keyValue = json;
    } else {
        keyValue = json[options.k];
    }
}

/**
 * Gets the size (in bytes) of the JSON key by casting it to a string and computing it.
 */
const getSize = function () {
    if (options.s) {
        let size = (new TextEncoder().encode(keyValue)).length
        console.log(`Size: ${size} bytes`);
    }
}

/**
 * Gets the length of the key, provided it is an array
 */
const getLength = function () {
    if (options.l) {
        if (Array.isArray(keyValue)) {
            console.log(`Length: ${keyValue.length}`);
        } else {
            console.log(`Length: Cannot get length of non-array key.`);
        }
    }
}

/**
 * Consoles the key value that is grabbed from the original JSON
 */
const getOutput = function () {
    if (options.o && keyValue) {
        console.log(keyValue);
    } else if (options.o) {
        console.log(json);
    }
    else{
        console.log(`Key: "${options.k}"`);
    }
}

/**
 * For debugging
 * @param {string} message The message to console out. Goes to stderr
 */
const debugLog = function (message) {
    if (debugMode) {
        console.error(message);
    }
}



module.exports = {
    processArgs
}