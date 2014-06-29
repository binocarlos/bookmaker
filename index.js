var EventEmitter = require('events').EventEmitter
var parser = require('markdown-parse')
var fs = require('fs')
var async = require('async')
var util = require('util')
var globby = require('globby')

function BookMaker(source, options){
  EventEmitter.call(this)

  this._source = source
  this._options = options
}

util.inherits(BookMaker, EventEmitter)

// an array of relative glob results
BookMaker.prototype.globs = function(glob, done){
	var self = this;
	if(typeof(glob)==='string'){
		glob = [glob]
	}
	globby(glob, {
		cwd:self._source
	}, done)
}

// an array of absolute file paths from globs
BookMaker.prototype.files = function(glob, done){
	var self = this;
	this.globs(glob, function(err, files){
		if(err) return done(err)
		files = files.map(function(file){
			return self._source + '/' + file
		})
		done(null, files)
	})
}


BookMaker.prototype.load = function(configGlob, pagesGlob, done){
	var self = this;

	async.parallel({
		config:function(next){
			self.loadConfigs(configGlob, next)
		},
		pages:function(next){
			self.loadPages(pagesGlob, next)
		}
	}, function(err, result){
		if(err) return done(err)
		var book = result.config
		book.pages = result.pages
		done(null, book)
	})
}

BookMaker.prototype.loadPages = function(glob, done){
	var self = this;
	self.files(glob, function(err, files){

		async.map(files, function(file, nextFile){
			fs.readFile(file, 'utf8', function(err, content){
				if(err) return nextFile(err)
				parser(content, nextFile)
			})
		}, done)

	})
}

BookMaker.prototype.loadConfigs = function(glob, done){
	var self = this;
	self.files(glob, function(err, files){
		if(err) return done(err)
		var config = {}
		files.filter(function(file){
			return file.match(/\.json/)
		}).map(function(file){
			return require(file)
		}).forEach(function(data){
			Object.keys(data || {}).forEach(function(key){
				config[key] = data[key]
			})
		})
		done(null, config)
	})
}

module.exports = function(source, options){
  return new BookMaker(source, options)
}