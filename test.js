var tape = require('tape')
var BookMaker = require('./')

tape('load the configs', function(t){
	var book = BookMaker(__dirname + '/book')

	book.loadConfigs('*.json', function(err, config){
		console.log('-------------------------------------------');
		console.dir(config)
		t.end()
	})
})
