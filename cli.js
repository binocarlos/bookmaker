#!/usr/bin/env node
var args = require('minimist')(process.argv, {
  alias:{
  	h:'help',
    c:'config',
    p:'pages',
    f:'files',
    i:'images',
		s:'imagesize'
  },
  default:{
    
  }
})

function usage(){
	var usage = [
		'usage: bookmaker [options] sourcefolder destfolder',
		'',
		'options:',
		'',
		'  --config, -c - a glob for the config files',
		'  --pages, -p - a glob for the .md pages',
		'  --files, -f - a glob for files to copy',
		'  --images, -i - a glob for images to resize',
		'  --imagesize, -s - the size for resized images',
	]

	console.log(usage.join("\n"))
}

var BookMaker = require('./index', args)
var resolve = require('cli-path-resolve')
var source = resolve(args._[0])
var dest = resolve(args._[1])

var book = BookMaker(source)

book.write(dest, args, function(){

})
