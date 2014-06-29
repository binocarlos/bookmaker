bookmaker
=========

Convert a folder of Markdown files into data ready for a [pagemaker](https://github.com/binocarlos/pagemaker) book

## install

```
$ npm install bookmaker
```

## usage

Each markdown file represents a page of the book and can have front-matter.  The values can be used in the book template to show images and play sounds.

An example of a single page .md:

```
---
title: Page 2
image: images/balloons.png
template: dinosaur
---

This is some markdown

It will be converted to HTML
```

Take a folder of these with some images and sounds and you can use the following code:

```js
var BookMaker = require('bookmaker')

// the base folder for the book content
var book = BookMaker(__dirname + '/test/book')

// a glob pattern for what .json files to merge into the top level book config
book.loadConfig('*.json', function(err, config){

	// the config is an object containing a merge of the *.json files

})

// a glob pattern for what markdown files to load for pages
book.loadPages('*.md', function(err, pages){

	// pages is an array of objects each representing a page
	pages.forEach(function(page){

		// page has .body .html and .attributes

	})
})

// a combination of getConfig and getPages
book.load('*.json', '*.md', function(err, book){
	// book has a 'pages' property

	// we can write the .json to the dest folder
})

// a glob pattern for the files to copy
book.copyFiles('*.{mp3,ogg}', targetFolder, function(err){
	// the source files have been copied to the target dir
})

// a glob pattern for the images to resize
book.resizeImages('*.{png,jpg,gif}', targetFolder, '600x400', function(err){
	// the source images have been resized and copied to the target dir
})
```

A simplied version of the above:

```js
var BookMaker = require('bookmaker')

// the base folder for the book content
var book = BookMaker(__dirname + '/test/book', {
	config:'*.json',
	pages:'*.md',
	files:'*.{mp3,ogg}',
	images:'*.{png,jpg,gif}',
	imageSize:'600x400'
})

book.write(__dirname + '/output', function(){

	// the book has been written to __dirname + '/output'

})
```

## api

### `var book = BookMaker(src)`

Create a new book object passing the folder root for where the markdown pages and other files live

### `book.loadConfig(glob, callback(err, config){})`

Load an object that is the result of merging the files found in the passed file glob.

This object is the top level of the book - the 'pages' property is populated by the markdown files.

Normally a single json file will be used but you can use a glob to merge multiple configs for one book:

```js
var book = BookMaker(src)

book.getConfig('{main,theme}.json', function(err, config){

	// config is main.json and theme.json merged

})
```

### `book.loadPages(glob, callback(err, pages){})`

Process each markdown file found in the glob and return an array of the JSON objects.

### `book.load(configGlob, pageGlob, callback(err, book){})`

A combo of loadConfig and loadPages that returns a single object that is the config with a 'pages' property

### `book.copyFiles(glob, targetFolder, done(error){})`

Copy a glob of files from the book folder to the targetFolder

### `book.resizeImages(glob, targetFolder, size, done(error){})`

Copy and resize the images in the glob.  Size can be a string: '100x100' or an object with 'width' and 'height' properties.

## licence
MIT

