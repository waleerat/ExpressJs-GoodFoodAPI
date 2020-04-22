const description = require('../../../lib/shema_description'); 
const graphql = require('graphql')
const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = graphql;

const responseStatus = require('../../share/response_status'); 
module.exports = new GraphQLObjectType({
  name : 'userInfo',
  description : description['userTypeFields'],
  fields: {
   id: { type: GraphQLID },
   username: { type : GraphQLString },
   password: { type : GraphQLString },
   email: { type : GraphQLString },
   firstName: { type : GraphQLString },
   lastName: { type : GraphQLString },
   fullName: {
    type: GraphQLString,
    resolve: obj => `${obj.firstName} ${obj.lastName}`
  },
   image: { type : GraphQLString },
   website: { type : GraphQLString },
   facebook: { type : GraphQLString },
   instagram: { type : GraphQLString },
   status: { type : GraphQLString },
   token: { type : GraphQLString },
   createDate: { type : GraphQLString },
   updateDate: { type : GraphQLString },
     
    responseStatus: { type: new GraphQLNonNull(responseStatus)} 
  }
})