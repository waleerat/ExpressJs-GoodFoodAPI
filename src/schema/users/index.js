const description = require('../../lib/shema_description');  // Discription 
const graphql = require('graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = graphql;

const userInfo = require('./type/user_info');

const RootQueryType = new GraphQLObjectType({
  name : "UserQuery",
  description : description['UserQuery'],
  fields : {
    user : {
      type: userInfo,
      description : description['userInfo'],
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