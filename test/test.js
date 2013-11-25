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
      console.log('-------------------------------------------');
      console.dir(data);
      done();
    })

    
  })

})
