const graphql = require('graphql')
const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = graphql;

module.exports = new GraphQLObjectType({
  name : 'MeType',

  fields: {
    id: { type: GraphQLID },
    email : { type : new GraphQLNonNull(GraphQLString)}
  }
})