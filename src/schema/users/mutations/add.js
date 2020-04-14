const description = require('../../../lib/schemaDescription'); 
const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const userModel = require('../../../models/usersModel');
const userInfo = require('../type/user_info');

const InputType = new GraphQLInputObjectType({
  name: 'NewRecord',
  description : description['userNewRecodeFields'],
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) }, 
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString }
  }
});

module.exports = {
  type: userInfo,
  description : description['userNewRecode'],
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
  resolve(obj, { input }, { pgPool }) {
    return userModel(pgPool).addNewRecord(input);
  }
};