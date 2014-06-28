var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require("node-fs");
var async = require('async');
var mergedirs = require('merge-dirs')

/*

var path = require('path');
var PageMaker = require('pagemaker');
var wrench = require('wrench');

*/

function BookMaker(options){
	EventEmitter.call(this);
	this.options = options || {};
}

util.inherits(BookMaker, EventEmitter);

module.exports = BookMaker;

BookMaker.prototype.getPageData = function(filepath, done){

}

BookMaker.prototype.getData = function(done){
	var self = this;

	if(!this.options.source){
		return done('please provide a source option')
	}

	if(!fs.existsSync(this.options.source)){
		return done(this.options.source + ' does not exist')
	}
	
	async.parallel({
		pages:function(next){
			fs.readdir(self.options.markdowns, function(error, files){
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
					if(error){
						next(error);
						return;
					}
					pages.sort(filename_sorter);
					next(null, pages);
				})
			})
		},
		data:function(next){
			self.read_data(next);
		}
	}, function(error, values){
		
		if(error){
			done(error);
			return;
		}
		var doc = values.data || {};
		doc.pages = values.pages || [];
		done(error, doc);

	})
}

BookMaker.prototype.mergeDirs = mergeDirs;

BookMaker.prototype.merge = function(done){
	var self = this;

	if(!this.options.output){
		console.error('please give an output folder');
		process.exit();
	}

	if(!fs.existsSync(this.options.folder)){
		console.error('data folder not found: ' + this.options.folder);
		process.exit();
	}

	if(!fs.existsSync(this.options.template)){
		console.error('template folder not found: ' + this.options.template);
		process.exit();
	}

	//wrench.rmdirSyncRecursive(this.options.output, true);
	//wrench.mkdirSyncRecursive(this.options.output, 0777);

	if(this.options.template){
		mergeDirs(this.options.template, this.options.output);	
	}
	
	mergeDirs(this.options.folder, this.options.output);

	var files = fs.readdirSync(this.options.output);

	(files || []).forEach(function(file){
		if(file.match(/\.md$/)){
			fs.unlinkSync(self.options.output + '/' + file);
		}
	})

	done && done();
}

BookMaker.prototype.write_output = function(content, done){
	if(this.options.output){
		if(this.options.output=='silent'){
			done();
		}
		else{
			fs.writeFile(this.options.output, content, 'utf8', done);	
		}
	}
	else{
		process.stdout.write(content);
	}
}

BookMaker.prototype.get_page_data = function(path, done){
	var page = new PageMaker({
  	infile:path
  });

  page.extract(done);
}

BookMaker.prototype.read_template = function(done){
	var template = this.options.template;

	if(!template){
		done();
		return;
	}

  if(template.charAt(0)!='/'){
    template = path.normalize(process.cwd() + '/' + template);
  }

  fs.readFile(template, 'utf8', done);
}

BookMaker.prototype.read_data = function(done){
	var file = this.options.datafile;

	if(!file){
		done(null, {});
		return;
	}

  if(file.charAt(0)!='/' && !file.match(/^\w:\\/i)){
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
					if(error){
						next(error);
						return;
					}
					pages.sort(filename_sorter);
					next(null, pages);
				})
			})
		},
		data:function(next){
			self.read_data(next);
		}
	}, function(error, values){
		
		if(error){
			done(error);
			return;
		}
		var doc = values.data || {};
		doc.pages = values.pages || [];
		done(error, doc);

	})

	


}