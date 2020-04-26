const {
  GraphQLObjectType,
  GraphQLString,
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
      totalPage: { type: GraphQLID  },
      page: { type: GraphQLID  },
      limit: { type: GraphQLID  },
      searchOption: { type: GraphQLString },
      searchKeys : { type: new GraphQLList(searchKey),
        resolve(obj) {
          return obj.searchKeys;
        }
      }, 
      rows: {
        type: new GraphQLList(recipesInfo),
        resolve(obj) {
          return obj.rows;
        }
      }
    };;
  }
});