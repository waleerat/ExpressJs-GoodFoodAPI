const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = graphql;

module.exports = new GraphQLObjectType({
  name : 'deleteResultType',

  fields: {
    length: { type : new GraphQLNonNull(GraphQLString)}
  }
})