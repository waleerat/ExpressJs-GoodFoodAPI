const util = require('./util')
const slugify = require('slugify');

module.exports = {
  maxLengthValue: (inputValue,inputType) =>{
    let response = util.getResponseStatusTag(999);
    let max_lenght_value = 0;
    if (inputType == 'title') max_lenght_value = process.env.MAX_LENGHT_TITLE;
    else if (inputType == 'slug') max_lenght_value = process.env.MAX_LENGTH_SLUG;

    if (max_lenght_value > 0 ){
      if (inputValue.length <= process.env.MAX_LENGHT_TITLE){
        response =  util.getResponseStatusTag(200);
      }else{
        response = util.getResponseStatusTag(910);
      } 
    } 
    return response;
  },
  slugTag: (title,slug) =>{
    if (slug === ''  || (typeof slug === 'undefined')){
      title= util.striptags(title.toLowerCase());
      return slugify(title); 
    } else {
      slug= util.striptags(slug.toLowerCase()); 
      return slugify(slug);
    } 
  },
  htmlTag: (inputValue) =>{
    let response = {"isvalidate": false}; let result={};
    if (inputValue.length <= process.env.MAX_LENGHT_SLUG){
      response =  {"isvalidate": true};
    }else{
      result = util.getResponseStatusTag(200);
      response =  {"isvalidate": false, "result": result};
    } 
    return response;
  },
  urlFormat: (str) =>{ 
    var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    var regex = new RegExp(expression); 
    if(!regex .test(str)) {
      return '';
    } else {
      return str;
    }
  },
  emailFormat: (email) =>{
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email); 
  }
};