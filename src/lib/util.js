const humps = require('humps');
const _ = require('lodash');
const striptags = require('striptags'); 
const crypto = require('crypto');
const bcrypt = require('bcrypt'); 

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
  endcodeMD5: str => {
    return crypto.createHash('md5').update(str).digest("hex"); 

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
      if (getpage) offset = (resGetpage-1)*resLimit;
      else offset = 0;
    } 
    console.log('offset = '+offset);
    
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
  },
  makeid(length) {
    var result           = '';
    var characters       = '0123456789'; //'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return parseInt(result);
  },
  async bcrypt(password){ console.log('Password : '+ password); 
    let min = 1; let max = 10; 
      let salt_rounds = Math.floor(Math.random() * (max - min) ) + min;
       await bcrypt.genSalt(salt_rounds, function(err, salt) { 
        return bcrypt.hash(password, salt, function(err, hash) {
          let r = {'salt_rounds':salt_rounds, "hash": hash};
          console.log(r);
            return r
          });
      });
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