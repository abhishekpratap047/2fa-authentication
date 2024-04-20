const readFile = require('../methods/readFile');
const products = require('../products');

module.exports = function(page_no, callback){

       if(!page_no){
              page_no = 1;
       }
       
       callback(products);
}