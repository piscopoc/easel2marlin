"use strict"

const fs = require('fs');
const path = require('path');
const fileReader = require('./fileReader');
const logger = require('pino')({ level: 'debug' });

const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

const argv = require('yargs')
    .options({
        'filePath': {
            alias: 'f',
            describe: 'input path to the easel generated gcode',
            demandOption: true
        },
        'travelSpeed': {
            alias: 's',
            describe: 'travel speed for G0 moves',
            default: 1000.0
        },
        'fileExtension': {
            alias: 'ext',
            describe: 'file extension to be used when generating output',
            default: 'gcode'
        }
    })
    .help()
    .argv


const getFileInformation = ({ filePath }) => {

    const sourceDirectory = path.dirname(filePath),
        fullName = path.basename(filePath),
        fileName = path.parse(fullName).name,
        extension = path.parse(fullName).ext;

    return {
        source_directory: sourceDirectory,
        file_name: fileName,
        extension: extension,
    }
};

const main = (async() => {

    const filePath = argv.filePath,
        travelSpeed = `F${argv.travelSpeed.toFixed(1)}`,
        outputFileExtension = argv.fileExtension;

    logger.info(`getting file information: ${filePath}`);
    const fileInformation = getFileInformation({ filePath: filePath });

    logger.info(`reading file contents to memory`);
    const fileContents = await fileReader.getContents({ file: filePath });

    logger.info(`file contains ${fileContents.length} lines; parsing generated gcode`);

    const output = fileContents.map((lineContent, lineNumber) => {
        let retVal = lineContent;

        logger.trace(lineContent);

        if (lineContent.indexOf('G0') > -1) {
            logger.info(`found G0 (linear movement) command on line ${lineNumber}; appending travel speed of ${travelSpeed}`);
            retVal = `${lineContent} ${travelSpeed}`;
        }

        return retVal;
    });

    const outputFile = `${fileInformation.source_directory}/${fileInformation.file_name}.${outputFileExtension}`;

    logger.info(`writing content to file`);
    await writeFileAsync(outputFile, output.join(`\n`));

    logger.info(`process complete; file created @ ${outputFile}`);

})();