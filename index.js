var EventEmitter = require('events').EventEmitter
var util = require('util')
var globby = require('globby')

function BookMaker(source, options){
  EventEmitter.call(this)

  this._source = source
  this._options = options
}

util.inherits(BookMaker, EventEmitter)

BookMaker.prototype.loadConfigs = function(glob, done){
	var self = this;
	if(typeof(glob)==='string'){
		glob = [glob]
	}
	globby(glob, {
		cwd:self._source
	}, function(err, files){
		if(err) return done(err)
		var config = {}
		files.forEach(function(file){
			if(file.match(/\.json/)){
				var data = require(self._source + '/' + file)
				Object.keys(data || {}).forEach(function(key){
					config[key] = data[key]
				})
			}
		})
		done(null, config)
	})
}

module.exports = function(source, options){
  return new BookMaker(source, options)
}