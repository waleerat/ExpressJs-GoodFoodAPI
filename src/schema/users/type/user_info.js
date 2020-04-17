const description = require('../../../lib/shema_description'); 
const graphql = require('graphql')
const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} = graphql;

const sqlQueryStatus = require('../../query_status_type'); 
module.exports = new GraphQLObjectType({
  name : 'userInfo',
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
    instagram: { type : GraphQLString },
    response: { type: new GraphQLList(sqlQueryStatus) }
  }
})