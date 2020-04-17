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
  slug: str => {
    return str.toLowerCase().replace(/[\s\W-]+/, '-');
  },
  isEmptyAndReplace: (str, replace) => {
    if(str === null || str === '') {
       return replace; 
    }else{
      return str;
    }
  },
};