const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'keys',
  fields: () => ({
    key: { type: new GraphQLNonNull(GraphQLString) }
    })
});