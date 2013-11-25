/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require('fs');
var Mustache = require('Mustache');
var async = require('async');
var path = require('path');
var PageMaker = require('pagemaker');

// turns page13.md into 13
function pagenumber_extractor(filename){
	filename = filename.replace(/\.\w+$/, '');
	filename = filename.replace(/\D/, '');
	var ret = parseInt(filename);
	if(isNaN(ret)){
		return null;
	}
	else{
		return ret;
	}
}

// sorts by filename -> pagenumber_extractor
function filename_sorter(a, b){
	var numa = pagenumber_extractor(a.filename);
	var numb = pagenumber_extractor(b.filename);

	if(numa>numb){ return 1; }
	else if(numa<numb){ return -1; }
	else { return 0; }
}

function BookMaker(options){
	EventEmitter.call(this);
	this.options = options || {};
}

util.inherits(BookMaker, EventEmitter);

module.exports = BookMaker;

BookMaker.prototype.convert = function(done){

}

BookMaker.prototype.get_page_data = function(path, done){
	var page = new PageMaker({
  	infile:path
  });

  page.extract(done);
}

BookMaker.prototype.read_data = function(done){
	var file = this.options.datafile;

	if(!file){
		done(null, {});
		return;
	}

  if(file.charAt(0)!='/'){
    file = path.normalize(process.cwd() + '/' + file);
  }

  fs.readFile(file, 'utf8', function(error, data){
  	data = JSON.parse(data);
  	done(error, data);
  });
}

BookMaker.prototype.extract = function(done){
	var self = this;

	async.parallel({
		pages:function(next){
			fs.readdir(self.options.folder, function(error, files){
				var markdowns = files.filter(function(file){
					return file.match(/\.md$/);
				})

				var pages = [];

				async.forEach(markdowns, function(filename, nextfile){
					self.get_page_data(self.options.folder + '/' + filename, function(error, data){
						data.filename = filename;
						pages.push(data);
						nextfile();
					})
				}, function(error){
					pages.sort(filename_sorter);
					console.log('-------------------------------------------');
					console.dir(pages);
					next();
				})
			})
		},
		data:function(next){
			self.read_data(next);
		}
	}, function(error, values){
		console.log('-------------------------------------------');
		console.dir(values);
		done(error, values);

	})

	


}