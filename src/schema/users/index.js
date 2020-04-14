const description = require('../../lib/schemaDescription');  // Discription 
const graphql = require('graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = graphql;

const UserType = require('./type/user_info');


const RootQueryType = new GraphQLObjectType({
  name : "RootQueryType",
  description : description['userRootQueryType'],
  fields : {
    user : {
      type: UserType,
      description : description['userType'],
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) }
      }
    } 
  }
});

const newRecord = require('./mutations/add');
const updateRecode = require('./mutations/update');
const changePasword = require('./mutations/change_password');

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutation',
  description : description['RootMutationType'],
  fields: () => ({
    newRecodeResult: newRecord,
    updateRecodeResult : updateRecode,
    changePasswordresult : changePasword
  })
});

const ncSchema = new GraphQLSchema({
  query : RootQueryType,
  mutation: RootMutationType
});

module.exports = ncSchema;