const description = require('../../../lib/shema_description');  
const util = require('../../../lib/util');

const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const userModel = require('../../../models/usersModel');
const userInfo = require('../type/user_info');

const InputType = new GraphQLInputObjectType({
  name: 'changePassword',
  description : description['userUpdateRecodeFields'],
  fields: { 
    oldpassword: { type : new GraphQLNonNull(GraphQLString)},
    newpassword: { type : new GraphQLNonNull(GraphQLString)},
  }
}); 

module.exports = {
  type: userInfo,
  description : description['userUpdateRecode'],
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
   resolve(obj,{ input }, { pgPool }) { 
    if (global.isAuthen){
      return userModel(pgPool).changePassword(input); 
    }else{
      return util.returnResponseStatusTag(902);
    }
  }
};

