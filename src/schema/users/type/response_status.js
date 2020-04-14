const description = require('../../../lib/schemaDescription'); 
const graphql = require('graphql')
const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString
} = graphql;


module.exports = new GraphQLObjectType({
  name : 'response',
  description : description['userTypeFields'],
  fields: {
    status: { type: GraphQLID },
    message: { type : GraphQLString }
  }
})