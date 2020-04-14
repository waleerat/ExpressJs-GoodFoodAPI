const description = require('../../../lib/schemaDescription'); 
const graphql = require('graphql')
const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString
} = graphql;


module.exports = new GraphQLObjectType({
  name : 'userType',
  description : description['userTypeFields'],
  fields: {
    id: { type: GraphQLID },
    firstName: { type : GraphQLString },
    lastName: { type : GraphQLString },
    username: { type : GraphQLString},
    email: { type : GraphQLString},
    fullName: {
      type: GraphQLString,
      resolve: obj => `${obj.firstName} ${obj.lastName}`
    },
    //token: { type : GraphQLString },
    image: { type : GraphQLString },
    website: { type : GraphQLString },
    facebook: { type : GraphQLString },
    instagram: { type : GraphQLString }
  }
})