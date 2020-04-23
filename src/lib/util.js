const humps = require('humps');
const _ = require('lodash');
const striptags = require('striptags');


module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  orderedFor: (rows, collection, field, singleObject) => {
    const data = humps.camelizeKeys(rows); 
      const inGroupsOfField = _.groupBy(data, field);
      return collection.map(element => {
        const elementArray = inGroupsOfField[element];
        if (elementArray) {
          return singleObject ? elementArray[0] : elementArray;
        }
        return singleObject ? {} : [];
      });
  }, 
  striptags: str => {
    return striptags(str);
  },
  getPageLimitText: (getpage,limit) => {
    let resGetpage = 0;
    let offset = 0;
    let resLimit = process.env.RECORDS_PAER_PAGE;
    if (limit)  resLimit = limit;
    if (getpage){
      offset = 0;
      if (getpage == 0) resGetpage = 1; else resGetpage = getpage;
    }else{
      if (resGetpage == 1) offset = 0;
      else offset = (resGetpage-1)*resLimit;
    } 
    
    return { "limit": resLimit,"offset":offset};
  },
  getResponseStatusTag: (status) => { 
    let message = getMessageStatus(status); 
     if (message == ''){
       message = "Status doesn't exist.";
       return {"status": "000","message": message};
     }else return {"status": status,"message": message}; 
  },
  returnResponseStatusTag: (status) => {
    let responseStatusTag = {};
    let returnRoot = {}; 
    let message = getMessageStatus(status);
     if (message == ''){
      responseStatusTag =  {"status": "000","message": message};
     }else responseStatusTag = {"status": status,"message": message}; 

    returnRoot.responseStatus=responseStatusTag;
    return returnRoot;
  }
};

function getMessageStatus(status){
  let message = "";
  switch(status){
    case 200 : message = "Success"; break;
    case 300 : message = "Added / Updated"; break;
    case 301 : message = "Updated Status #number# row(s) from  #number2#"; break;
    case 302 : message = "Deleted #number# row(s) from  #number2#"; break;
    case 900 : message = "Authentication failed!"; break;
    case 901 : message = "Your current password #oldPassword# is not correct"; break;
    case 902 : message = "Require Login"; break; 
    case 903 : message = "Username is exist"; break; 
    case 904 : message = "Updating faild!"; break; 
    case 910 : message = "Length of title is more than 90"; break; 
    case 911 : message = "Length of title is more than 50"; break; 
    case 912 : message = "Wrong URL format"; break;
    case 999 : message =  "Something went wrong!"; break;
   }
   return message
}