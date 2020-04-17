const description = require('../../../lib/shema_description');  
const { getResponseStatusTag } = require('../../../lib/util');

const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const userModel = require('../../../models/usersModel');
const responseStatus = require('../type/response_status');

const InputType = new GraphQLInputObjectType({
  name: 'changePassword',
  description : description['userUpdateRecodeFields'],
  fields: { 
    oldpassword: { type : new GraphQLNonNull(GraphQLString)},
    newpassword: { type : new GraphQLNonNull(GraphQLString)},
  }
}); 

module.exports = {
  type: responseStatus,
  description : description['userUpdateRecode'],
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
   resolve(obj,{ input }, { pgPool }) {  
    if (global.isAuthen){
      return userModel(pgPool).changePassword(input); 
    }else{
      return getResponseStatusTag(902);
    }
  }
};

