var tape = require('tape')
var BookMaker = require('../src');
var fs = require('fs');
var wrench = require('wrench');

tape('should load a single config', function(t) {
  var maker = BookMaker(__dirname + '/book')
    
  maker.getConfig('book.json', function(error, config){

    t.end()
    
  })

  
})
