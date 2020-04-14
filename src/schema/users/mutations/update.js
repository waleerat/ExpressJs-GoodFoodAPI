const description = require('../../../lib/schemaDescription');  

const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const userModel = require('../../../models/usersModel');
const UserType = require('../type/user_info');

const InputType = new GraphQLInputObjectType({
  name: 'updateRecode',
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
    return userModel(pgPool).updateRecord(input); 
  }
};

