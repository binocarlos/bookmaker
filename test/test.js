var BookMaker = require('../src');
var fs = require('fs');

function get_maker(){
  return new BookMaker({
    folder:__dirname + '/pages',
    outfile:'silent',
    datafile:__dirname + '/test.json',
    template:__dirname + '/template.html'
  });
}

describe('BookMaker', function(){

  it('should extract data', function(done) {
    var maker = get_maker();

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

    var maker = get_maker();

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


})
