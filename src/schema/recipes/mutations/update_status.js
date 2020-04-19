const description = require('../../../lib/shema_description'); 
const {getResponseStatusTag} = require('../../../lib/util');
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLString
} = require('graphql');

const recipesModel = require('../../../models/recipesModel');
const responseStatus = require('../../share/response_status'); 
const targetID = require('../../share/input_target_ids');

const InputType = new GraphQLInputObjectType({
  name: "UpdateIDs",
  description: description['recipeUpdateStatus'],
  fields: 
    { 
      newStatus: { type: new GraphQLNonNull(GraphQLString) },
      recipes: { type: new GraphQLList(targetID) }
    }
});

module.exports = {
  type: responseStatus,
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
  resolve(obj, { input }, { pgPool }) {
    if (global.isAuthen){
      return recipesModel(pgPool).updateStatus(input);
    }else{
      return getResponseStatusTag(902);
    }
  }
};