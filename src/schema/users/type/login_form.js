const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const userModel = require('../../../models/usersModel');
const description = require('../../../lib/schemaDescription'); 
const authenType = require('./authen_info');
const InputType = new GraphQLInputObjectType({
  name: 'loginForm',
  description : description['userUpdateRecodeFields'],
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  }
});


module.exports = {
  type: authenType,
  description : description['userGetAuthentication'],
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
   resolve(obj, { input }, { pgPool }) { 
    return userModel(pgPool).getAuthenticationInfo(input); 
  }
};

