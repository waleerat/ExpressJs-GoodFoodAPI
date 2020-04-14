const description = require('../../../lib/schemaDescription');
const graphql = require('graphql')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = graphql;

module.exports = new GraphQLObjectType({
  name : 'authentication',
  description : description['userTypeFields'],
  fields: {
    token: { type: GraphQLString },
    status: { type : new GraphQLNonNull(GraphQLString)},
    message: { type: GraphQLString }
  }
})