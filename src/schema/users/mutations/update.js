const description = require('../../../lib/shema_description');   

const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const userModel = require('../../../models/usersModel');
const UserType = require('../type/user_info');
const util = require('../../../lib/util'); 

const InputType = new GraphQLInputObjectType({
  name: 'inputKeys',
  description : description['userUpdateRecodeFields'],
  fields: {
    firstName: { type: GraphQLString },  
    lastName: { type: GraphQLString },
    image: { type: GraphQLString },
    website: { type: GraphQLString },
    facebook: { type: GraphQLString },
    instagram: { type: GraphQLString }
  }
});


module.exports = {
  type: UserType,
  description : description['userUpdateRecode'],
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
   resolve(obj,{ input }, { pgPool }) { 
      if (global.isAuthen){ 
        return userModel(pgPool).updateRecord(input);
      } else {
        return util.returnResponseStatusTag(902);
      }
  }
};
