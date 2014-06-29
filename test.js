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


tape('load the pages', function(t){
	var book = BookMaker(__dirname + '/book')

	book.loadPages('*.md', function(err, pages){
		if(err){
			t.fail(err, 'load pages')
			t.end()
			return
		}
		t.equal(pages.length, 3, 'pages.length')
		t.equal(pages[0].attributes.options, 'A', 'the attr from page1')
		t.equal(pages[0].html, '<p>This is page 1</p>', 'markdown parsed')
		t.end()
	})
})