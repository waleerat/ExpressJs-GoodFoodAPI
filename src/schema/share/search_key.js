const {
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'searchKey', 
  fields: () => ({
    type: { type: GraphQLString },
    key: { type: GraphQLString }
  })
});