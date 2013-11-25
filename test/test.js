var BookMaker = require('../src');
var fs = require('fs');
var wrench = require('wrench');

describe('BookMaker', function(){

  it('should extract data', function(done) {
    var maker = new BookMaker({
      folder:__dirname + '/pages',
      output:'silent',
      datafile:__dirname + '/test.json',
      template:__dirname + '/template.html'
    });

    maker.extract(function(error, data){

      data.test.should.equal('yes');
      data.fruit.should.equal('apples');
      data.pages.length.should.equal(3);
      data.pages[0].html.should.equal("<p>This is page 1</p>\n");
      data.pages[1].option.should.equal('B');
      data.pages[2].filename.should.equal('page3.md');
      done();
    })

    
  })

  it('should convert pages', function(done) {

    var maker = new BookMaker({
      folder:__dirname + '/pages',
      output:'silent',
      datafile:__dirname + '/test.json',
      template:__dirname + '/template.html'
    });

    maker.convert(function(error, output){
      output.should.equal([
        "apples",
        "page1.md:A",
        "page2.md:B",
        "page3.md:C",
        ""
      ].join("\n"));
      done();
    })
    
  })

  describe('Merge', function(){

    after(function(){
      wrench.rmdirSyncRecursive(__dirname + '/testoutput', true);
    });

    it('should merge folders', function(done) {

      var maker = new BookMaker({
        folder:__dirname + '/pages',
        output:__dirname + '/testoutput',
        template:__dirname + '/apptemplate'
      });

      maker.merge();

      var files = fs.readdirSync(__dirname + '/testoutput');
      files.length.should.equal(2);

      var found = {};
      files.forEach(function(file){
        found[file] = true;
      })

      found['site.css'].should.equal(true);
      found['pages.css'].should.equal(true);
      done();
      
    })
  })


})
