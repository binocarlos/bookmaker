var EventEmitter = require('events').EventEmitter
var parser = require('markdown-parse')
var fs = require('fs')
var async = require('async')
var util = require('util')
var globby = require('globby')
var resize = require('imagemagickresizer')()
var path = require('path')
var mkdirp = require('mkdirp')

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
			return path.normalize(self._source + '/' + file)
		})
		done(null, files)
	})
}

BookMaker.prototype.fileCopies = function(glob, dest, done){
	var self = this;
	this.globs(glob, function(err, files){
		if(err) return done(err)
		files = files.map(function(file){
			return {
				source:path.normalize(self._source + '/' + file),
				dest:path.normalize(dest + '/' + file)
			}
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


BookMaker.prototype.copyFiles = function(glob, dest, done){
	var self = this;
	if(!fs.existsSync(dest)){
		return done(dest + ' does not exist')
	}
	self.fileCopies(glob, dest, function(err, files){
		if(err) return done(err)
		async.forEach(files, function(file, next){
			var source = fs.createReadStream(file.source)
			var dest = fs.createWriteStream(file.dest)
			dest.on('error', next)
			dest.on('close', next)
			source.pipe(dest)
		}, done)
	})
}

BookMaker.prototype.resizeImages = function(glob, dest, size, done){
	var self = this;
	if(!fs.existsSync(dest)){
		return done(dest + ' does not exist')
	}
	if(typeof(size)==='string'){
		var parts = size.replace(/\s/g, '').split('x')
		size = {
			width:parts[0],
			height:parts[1]
		}
	}
	self.fileCopies(glob, dest, function(err, files){
		if(err) return done(err)
		async.forEach(files, function(file, next){

			resize.image(file.source, file.dest, size, next)

		}, done)
	})
}

module.exports = function(source, options){
  return new BookMaker(source, options)
}