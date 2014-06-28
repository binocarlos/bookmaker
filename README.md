bookmaker
=========

Convert a folder of Markdown files into data ready for a [pagemaker](https://github.com/binocarlos/pagemaker) book

## install

```
$ npm install bookmaker
```

## usage

```
var BookMaker = require('bookmaker')

// the base folder for the book content
var book = BookMaker(__dirname + '/test/book')

// a glob pattern for what .json files to merge into the top level book config
book.getConfig('*.json', function(err, config){

	// the config is an object containing a merge of the *.json files

})

// a glob pattern for what markdown files to load for pages
book.getPages('*.md', function(err, pages){

	// pages is an array of objects each representing a page
	pages.forEach(function(page){

		// page has .body .html and .attributes

		if(page.attributes.image){
			// copy image logic here

		}
	})
})

// a glob pattern for what files to pluck
book.processFiles('*.{png,jpg,gif,mp3,ogg}', function(filepath, next){

	// filepath is relative to the book root

	// here we can copy / resize or otherwise ignore the file
	// calling next(error) or next() will progress the glob

}, function(err){

	// all files in the glob have been processed

})
```

An example of a single page .md:

```
---
title: Page 2
image: images/myths2.png
template: dinosaur
caption1: Why is the arch a good place to sit in hot weather?
captionsound1: sounds/dino-page2-caption1.mp3
caption2: Why does Pan think he can see Hoofus in the book?
captionsound2: sounds/dino-page2-caption2.mp3
---

The arch was part of a fort and it is a good spot to sit down in the summer out of the sun.

In the book they see a town.

Pan sees the back of a goat next to a cart. "Look, that might be Hoofus," he yells, "I can see his horns too."
```

## api

### `var book = BookMaker(src)`

Create a new book object passing the folder root for where the markdown pages and other files live

### `book.getConfig(glob, callback(err, config){})`

Load an object that is the result of merging the files found in the passed file glob.

This object is the top level of the book - the 'pages' property is populated by the markdown files.

Normally a single json file will be used but you can use a glob to merge multiple configs for one book:

```js
var book = BookMaker(src)

book.getConfig('{main,theme}.json', function(err, config){

	// config is main.json and theme.json merged

})
```

### `book.getPages(glob, callback(err, pages){})`

Load an array of page objects that are the result of processing the markdown files found in the glob.

### `book.processFiles(glob, process(filepath, next){}, done(error){})`

Process the media / general files found in the source folder.

Pass a process function that accepts the filepath (relative to the book source) and a next function.

Calling the next function with an error as the first argument - halts the processing 

## licence
MIT

