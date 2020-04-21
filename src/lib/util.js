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
/*   slug: str => {
    return str.toLowerCase().replace(/[\s\W-]+/, '-');
  }, */
  getResponseStatusTag: (status) => {
    let message = "Status doesn't exist.";
    switch(status){
      case 200 : message = "Success"; break;
      case 300 : message = "Added / Updated"; break;
      case 301 : message = "Updated Status #number# row(s) from  #number2#"; break;
      case 302 : message = "Deleted #number# row(s) from  #number2#"; break;
      case 900 : message = "Authentication failed!"; break;
      case 901 : message = "Your current password #oldPassword# is not correct"; break;
      case 902 : message = "Require Login"; break; 
      case 903 : message = "Username is not exist"; break; 
      case 904 : message = "Updating faild!"; break; 
      case 910 : message = "Length of title is more than 90"; break; 
      case 911 : message = "Length of title is more than 50"; break; 
      case 912 : message = "Wrong URL format"; break;
      case 999 : message =  "Something went wrong!"; break;
     }

     if (message == ''){
       return {"status": "000","message": message};
     }else return {"status": status,"message": message};
      
 
  },
};