#!/usr/bin/env node

/**
 * Module dependencies.
 */
var version = require(__dirname + '/../package.json').version;
var program = require("commander");
var PageMaker = require('../src')


program
  .option('-f, --folder <path>', 'the folder containing markdown files')
  .option('-o, --output <path>', 'the output HTML file - stdout is default')
  .option('-d, --datafile <path>', 'a JSON file to be used as the base variables')
  .option('-t, --template <path|name>', 'the template to use')
  .version(version)

program
  .command('convert')
  .description('convert a folder of markdown files into a HTML page using a template')
  .action(function(){

    var maker = new BookMaker({
      folder:program.folder,
      output:program.output,
      template:program.template,
      datafile:program.datafile
    });

    maker.convert();
  })

// run help if the command is not known or they just type 'digger'
program
  .command('*')
  .action(function(command){
    console.log('bookmaker version ' + version + ' - \'bookmaker --help\' for more info');
  });

if(process.argv.length<=2){
  process.argv.push(['--help']);
}

program.parse(process.argv);