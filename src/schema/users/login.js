const description = require('../../lib/shema_description');
const authenInfo = require('./type/authen_info');
const Authentication = require('./mutations/authen');

//Import type hemlper from grapql-js
const graphql = require('graphql');
const {
  GraphQLSchema,
  GraphQLObjectType
} = graphql;

// The root query type is where in the data graph
// we can start asking questions
const RootQueryType = new GraphQLObjectType({
  name : "authenticationQuery",

  fields : {
    authenInfo : {
      type: authenInfo, 
      fields: () => ({
        authenInfo: Authentication  
      }),
      description : description['authenticationQuery']
    } 
  }
});


const RootMutationType = new GraphQLObjectType({
  name: 'getAuthentication',
  description : description['getAuthentication'],
  fields: () => ({
    authenInfo: Authentication  //  authenInfo(input: $input) { 
  })
});

const ncSchema = new GraphQLSchema({
  query : RootQueryType,
  mutation : RootMutationType
});

module.exports = ncSchema;


/* Mutation Request
 mutation authenInfo($input: requestLogin!) {
  tokenAccess(input: $input) {
    token
    status
    message
  }
}   
 */