const {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');

module.exports = new GraphQLInputObjectType({
  name: 'targetIds',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) }
    })
});