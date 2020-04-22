const {
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const searchOption = require('../share/recipe_search_option_type');

module.exports = new GraphQLInputObjectType({
  name: 'searchKeyInput', 
  fields: () => ({ 
    page: { type: GraphQLID  },
    limit: { type: GraphQLID  },
    searchOption: { type: new GraphQLNonNull(searchOption) },
    searchkey: { type: GraphQLString  }
  })
});