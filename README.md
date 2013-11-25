bookmaker
=========

Process a folder of markdown files into a single template driven app.

Each page has front-matter which can be used in the template which is compiled out of all page data.

## example

Convert a folder full of markdown files into a book.

```
$ bookmaker -d ./pages -t ./template.html -o build/index.html
```

This will create a 'book' variable with a 'pages' array that the template can use.

A template to render the book:

```html
<!doctype html>
<html>
  <head>
    <title>{{ title }}</title>
  </head>
  <body>
    {{#pages}}
      {{{html}}}
    {{/pages}}
  </body>
</html>
```

## installation

```
$ sudo npm install bookmaker -g
```

## help

```
do bookmaker help and copy output here
```

## licence
MIT

