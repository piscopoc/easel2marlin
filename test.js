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
            demandOption: true
        }
    })
    .help()
    .argv



let main = (async(args) => {


    console.log(argv);
    console.log(argv.filePath);
    if (argv.ships > 3 && argv.distance < 53.5) {
        console.log('Plunder more riffiwobbles!')
    } else {
        console.log('Retreat from the xupptumblers!')
    }

})();