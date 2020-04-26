const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

module.exports = new GraphQLInputObjectType({
  name: 'skeys',
  fields: () => ({
    key: { type: new GraphQLNonNull(GraphQLString) }
    })
});