const description = require('../../../lib/shema_description'); 
const {getResponseStatusTag} = require('../../../lib/util');
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} = require('graphql');

const recipesModel = require('../../../models/recipesModel');
const sqlQueryStatus = require('../../query_status_type'); 

const InputType = new GraphQLInputObjectType({
  name: "MoveToTrashIDs",
  description: description['recipeMoveToTrash'],
  fields: 
    { 
      recipes: { type: new GraphQLList( 
        new GraphQLInputObjectType({
          name: 'trashIds',
          fields: () => ({
            id: { type: new GraphQLNonNull(GraphQLInt) }
            })
        }) 
      ) }
    }
});

module.exports = {
  type: sqlQueryStatus,
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
  resolve(obj, { input }, { pgPool }) {
    if (global.isAuthen){
      return recipesModel(pgPool).moveRecipesToTrash(input);
    }else{
      return getResponseStatusTag(902);
    }
  }
};