const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'ingredientsInfo', 

  fields: () => {
    const recipesInfo = require('./ingredient_info_type');
    const searchKey = require('../../share/search_key');
    return {
      rowCount : { type: GraphQLID },
      searchKey : { type: new GraphQLNonNull(searchKey),
        resolve(obj) {
          return obj.searchKey;
        }
      }, 
      rows: {
        type: new GraphQLList(recipesInfo),
        resolve(obj) {
          return obj.rows;
        }
      }
    };
  }
});