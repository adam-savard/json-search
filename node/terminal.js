const yargs = require('yargs');
const fs = require('fs');
const json;
const keyValue;


//declarartion of options to be used

const options = yargs
    .usage("Usage: -f <filename> -k <key> <options>")
    .option("f", {
        alias: "file",
        describe: "The file to be used as input",
        type: "string",
        default: ""
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
        default: false
    })
    .option("l", {
        alias: "get-length",
        describe: "Gets the length of the array, given the key's value is an array.",
        type: "boolean",
        default: false
    })
    .option("o", {
        alias: "output",
        describe: "Sets whether the key provided should be logged or not.",
        type: "boolean",
        default: true
    })
    .argv;
/**
 * Processes all of the argv options in turn, starting with the file. Goes by a preset list of commands.
 */
const processArgs = function () {
    readFile();
    getKey();
    getSize();
    getLength();
    getOutput();
}

/**
 * Reads the file given from the terminal (if any) and stores it in a const called json
 */
const readFile = function () {

    if (options.f == "") {
        //use stdin
        console.error(`Not implemented yet for stdin. Check back soon!`);
    } else {
        //read the file from disk
        json = JSON.parse(fs.open(options.f, "r", function (error, fd) {
            if (error) {
                console.error(`No such file: ${options.f}`);
            }
        }));
    }
}

/**
 * Gets the key from the JSON, and stores it. The key is logged out by default
 */
const getKey = function () {
    if (options.k == "") {
        //if there's no key provided, just log the whole thing back out
        keyValue = json;
    } else {
        keyValue = json[key];
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
const getLength = function(){
    if(Array.isArray(keyValue) && options.l){
        console.log(`Length: ${keyValue.length}`);
    }
    else{
        console.log(`Length: Cannot get length of non-array key.`);
    }
}

/**
 * Consoles the key value that is grabbed from the original JSON
 */
const getOutput = function(){
    if(options.o){
        console.log(keyValue);
    }
}



module.exports = {
    processArgs
}