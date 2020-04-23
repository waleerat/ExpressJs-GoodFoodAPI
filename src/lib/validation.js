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
    title= util.striptags(title.toLowerCase());
    slug= util.striptags(slug.toLowerCase());
    
    if (slug == ''){
      return slugify(title); 
    }return slugify(slug); 
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
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(str)) {
      return util.getResponseStatusTag(912);
    } else {
      return str;
    }
  },
  emailFormat: (email) =>{
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email); 
  }
};