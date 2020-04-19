const humps = require('humps');
const _ = require('lodash');
const striptags = require('striptags');


module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  orderedFor: (rows, collection, field, singleObject) => {
    // return the rows ordered for the collection
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
     var resMessage;
     switch(status){
      case 200 :  
        resMessage = "Success"; 
        break;
      case 300 :  
        resMessage = "Added / Updated";
      break;
      case 301 :  
        resMessage = "Update Status";
      break;
      case 302 :  
        resMessage = "Deleted #number# row(s) ";
      break;
      case 900 :  
        resMessage = "Authentication failed!";
        break;
      case 901 :  
        resMessage = "Your current password #oldPassword# is not correct";
        break;
      case 902 :  
        resMessage = "Require Login";
      break; 
      case 999 :  
      resMessage = "Something went wrong!";
      break;
      default: 
          status = "000";
          resMessage = "Status doesn't exist.";
          break;
     }
  
     return {"status":status, "message": resMessage};
  },
};