const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'categoriesInfo', 

  fields: () => {
    const recipesInfo = require('../type/category_info_type');
    const searchKey = require('../../share/search_key');
    return {
      rowCount : { type: GraphQLID },
      totalPage: { type: GraphQLID  },
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