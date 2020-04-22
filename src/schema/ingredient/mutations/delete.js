const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

const description = require('../../../lib/shema_description'); 
const {getResponseStatusTag} = require('../../../lib/util');
const ingredientsModel = require('../../../models/ingredientsModel');
const responseStatus = require('../../share/response_status'); 
const targetID = require('../../share/input_target_ids');

const InputType = new GraphQLInputObjectType({
  name: "DeleteIDs",
  description: description['ingredientDelete'],
  fields: 
    { 
      ingredients: { type: new GraphQLList(targetID) }
    }
});

module.exports = {
  type: responseStatus,
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
  resolve(obj, { input }, { pgPool }) {
    if (global.isAuthen){
      return ingredientsModel(pgPool).deleteRecords(input);
    }else{
      return getResponseStatusTag(902);
    } 
  }
};