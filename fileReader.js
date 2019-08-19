"use strict"

const fs = require('fs');
const readline = require('readline');
const stream = require('stream');


const readLines = ({ file }) => {

    const rs = fs.createReadStream(file),
        output = new stream.PassThrough({ objectMode: true }),
        rl = readline.createInterface({ input: rs });

    rl.on("line", line => {
        output.write(line);
    });

    rl.on("close", () => {
        output.push(null);
    });

    return output;
};

const getContents = async({ file }) => {

    let retVal = [];
    for await (const line of readLines({ file })) {
        retVal.push(line);
    }

    return retVal;
}

module.exports.getContents = getContents;