const description = require('../../../lib/shema_description'); 
const {getResponseStatusTag} = require('../../../lib/util');
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString
} = require('graphql');

const categoriesModel = require('../../../models/categoriesModel');
const responseStatus = require('../../share/response_status'); 
const targetID = require('../../share/input_target_ids');

const InputType = new GraphQLInputObjectType({
  name: "UpdateIDs",
  description: description['categoryUpdateStatus'],
  fields: 
    { 
      newStatus:  { type: new GraphQLNonNull(GraphQLString) },
      categories: { type: new GraphQLList(targetID) }
    }
});

module.exports = {
  type: responseStatus,
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
  resolve(obj, { input }, { pgPool }) {
    if (global.isAuthen){
      return categoriesModel(pgPool).updateStatus(input);
    }else{
      return getResponseStatusTag(902);
    }
  }
};