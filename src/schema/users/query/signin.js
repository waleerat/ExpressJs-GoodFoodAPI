const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const userModel = require('../../../models/usersModel');
const description = require('../../../lib/shema_description'); 
const userInfo = require('../type/user_info');

const InputType = new GraphQLInputObjectType({
  name: 'authenKeys',
  description : description['userUpdateRecodeFields'],
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  }
});

module.exports = {
  type: userInfo,
  description : description['userGetAuthentication'],
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
   resolve(obj, { input }, { pgPool }) { 
    const r = userModel(pgPool).getAuthenticationInfo(input);
    return r; 
  }
};

