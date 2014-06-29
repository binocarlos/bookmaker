var tape = require('tape')
var BookMaker = require('./')

tape('load the configs', function(t){
	var book = BookMaker(__dirname + '/book')

	book.loadConfigs('*.json', function(err, config){
		if(err){
			t.fail(err, 'load config')
			t.end()
			return
		}
		t.deepEqual(config, {
			test:'yes',
			fruit:'apples',
			color:'red'
		})
		t.end()
	})
})
