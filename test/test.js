var BookMaker = require('../src');
var fs = require('fs');

function get_maker(){
  return new BookMaker({
    folder:__dirname + '/pages',
    output:__dirname + '/test.html',
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
      data.pages[0].body.should.equal("<p>This is page 1</p>\n");
      data.pages[1].option.should.equal('B');
      data.pages[2].filename.should.equal('page3.md');
      done();
    })

    
  })

})
