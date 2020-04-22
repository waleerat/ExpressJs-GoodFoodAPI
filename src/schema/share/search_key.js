const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'searchKey', 
  fields: () => ({
    page: { type: GraphQLID  },
    limit: { type: GraphQLID  },
    searchOption: { type: GraphQLString },
    searchKey: { type: GraphQLString  }
  })
});