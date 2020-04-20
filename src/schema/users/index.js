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
  description : description['userInfo'],
  fields : {
    user : {
      type: userInfo,
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) }
      }
    } 
  }
});

const signup = require('./mutations/signup');
const updateRecode = require('./mutations/update');
const changePasword = require('./mutations/change_password');

const RootMutationType = new GraphQLObjectType({
  name: 'UserMutation',
  description : description['UserMutation'],
  fields: () => ({
    signupResult: signup,
    updateRecodeResult : updateRecode,
    changePasswordresult : changePasword
  })
});

const ncSchema = new GraphQLSchema({
  query : RootQueryType,
  mutation: RootMutationType
});

module.exports = ncSchema;