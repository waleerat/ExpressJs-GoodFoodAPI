const {
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'status', 
  fields: () => ({
    status: { type: GraphQLString },
    message: { type: GraphQLString }
  })
});