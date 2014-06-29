var EventEmitter = require('events').EventEmitter
var util = require('util')

function BookMaker(source, options){
  EventEmitter.call(this)

  this._source = source
  this._options = options
}

util.inherits(BookMaker, EventEmitter)



module.exports = function(source, options){
  return new BookMaker(source, options)
}