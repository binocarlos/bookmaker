bookmaker
=========

Process a folder of markdown files into a single template driven app.

Each page has front-matter which can be used in the template which is compiled out of all page data.

## example

```
$ bookmaker -d ./pages -t ./template.html -o build/index.html
```

This will create a 'book' variable with a 'pages' array that will render using 'template.html'

The example data:

```js
{ test: 'yes',
  fruit: 'apples',
  pages:
   [ { title: 'page1',
       option: 'A',
       html: '<p>This is page 1</p>\n',
       body: '\nThis is page 1',
       filename: 'page1.md' },
     { title: 'page2',
       option: 'B',
       html: '<p>This is page 2</p>\n',
       body: '\nThis is page 2',
       filename: 'page2.md' },
     { title: 'page3',
       option: 'C',
       html: '<p>This is page 3</p>\n',
       body: '\nThis is page 3',
       filename: 'page3.md' } ] }
```

The example template:

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

