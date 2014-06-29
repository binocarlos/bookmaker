var tape = require('tape')
var wrench = require('wrench')
var fs = require('fs')
var BookMaker = require('./')

function checkConfig(t, config){
	t.deepEqual(config, {
		test:'yes',
		fruit:'apples',
		color:'red'
	})
}

function checkPages(t, pages){
	t.equal(pages.length, 3, 'pages.length')
	t.equal(pages[0].attributes.option, 'A', 'the attr from page1')
	t.equal(pages[0].html, "<p>This is page 1</p>\n", 'markdown parsed')
}

tape('load the configs', function(t){
	var book = BookMaker(__dirname + '/book')

	book.loadConfigs('*.json', function(err, config){
		if(err){
			t.fail(err, 'load config')
			t.end()
			return
		}
		checkConfig(t, config)
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
		checkPages(t, pages)
		t.end()
	})
})


tape('load', function(t){
	var book = BookMaker(__dirname + '/book')
	book.load('*.json', '*.md', function(err, book){
		if(err){
			t.fail(err, 'load pages')
			t.end()
			return
		}
		checkPages(t, book.pages)
		delete(book.pages)
		checkConfig(t, book)
		
		t.end()
	})
})

tape('copy files', function(t){
	var book = BookMaker(__dirname + '/book')

	wrench.rmdirSyncRecursive(__dirname + '/testoutput', true)
	wrench.mkdirSyncRecursive(__dirname + '/testoutput')

	book.copyFiles('**/*.{jpg,mp3}', __dirname + '/testoutput', function(err){
		if(err){
			t.fail(err, 'copy files')
			t.end()
			return
		}
		t.ok(fs.existsSync(__dirname + '/testoutput/balloons.jpg'), 'balloons exists')
		t.ok(fs.existsSync(__dirname + '/testoutput/car.jpg'), 'car exists')
		t.ok(fs.existsSync(__dirname + '/testoutput/subfolder/car.jpg'), 'car exists')
		wrench.rmdirSyncRecursive(__dirname + '/testoutput', true)
		t.end()
	})
})

tape('resize images', function(t){
	var book = BookMaker(__dirname + '/book')

	wrench.rmdirSyncRecursive(__dirname + '/testoutput', true)
	wrench.mkdirSyncRecursive(__dirname + '/testoutput')

	book.resizeImages('*.{jpg,png}', __dirname + '/testoutput', '100x100', function(err){
		if(err){
			t.fail(err, 'resize images')
			t.end()
			return
		}
		t.ok(fs.existsSync(__dirname + '/testoutput/balloons.jpg'), 'balloons exists')
		t.ok(fs.existsSync(__dirname + '/testoutput/car.jpg'), 'car exists')
		wrench.rmdirSyncRecursive(__dirname + '/testoutput', true)
		t.end()
	})
})


tape('write book', function(t){
	var book = BookMaker(__dirname + '/book')

	wrench.rmdirSyncRecursive(__dirname + '/testoutput', true)
	wrench.mkdirSyncRecursive(__dirname + '/testoutput')

	book.write(__dirname + '/testoutput', {
		config:'*.json',
		pages:'*.md',
		images:'**/*.{png,jpg}',
		imageSize:'600x400'
	}, function(err){
		if(err){
			t.fail(err, 'resize images')
			t.end()
			return
		}

		var book = require(__dirname + '/testoutput/book.json')

		checkPages(t, book.pages)
		delete(book.pages)
		checkConfig(t, book)

		t.ok(fs.existsSync(__dirname + '/testoutput/balloons.jpg'), 'balloons exists')
		t.ok(fs.existsSync(__dirname + '/testoutput/car.jpg'), 'car exists')
		t.ok(fs.existsSync(__dirname + '/testoutput/subfolder/car.jpg'), 'car exists')
		
		wrench.rmdirSyncRecursive(__dirname + '/testoutput', true)
		t.end()
	})
})