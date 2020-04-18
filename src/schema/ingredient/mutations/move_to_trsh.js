const description = require('../../../lib/shema_description'); 
const {getResponseStatusTag} = require('../../../lib/util');
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} = require('graphql');

const ingredientsModel = require('../../../models/ingredientsModel');
const sqlQueryStatus = require('../../query_status_type'); 

const InputType = new GraphQLInputObjectType({
  name: "MoveToTrashIDs",
  description: description['ingredientMovetoTrash'],
  fields: 
    { 
      ingredients: { type: new GraphQLList( 
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
      return ingredientsModel(pgPool).moveIngredientsToTrash(input);
    }else{
      return getResponseStatusTag(902);
    }
  }
};