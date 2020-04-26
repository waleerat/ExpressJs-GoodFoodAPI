const {
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'searchKey', 
  fields: () => ({ 
    key: { type: GraphQLString  }
  })
});