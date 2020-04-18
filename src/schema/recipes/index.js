

const description = require('../../lib/shema_description'); 

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const RecipeInfo = require('./type/recipe_info'); 

const RootQueryType = new GraphQLObjectType({
  name : "recipeQuery", 
  fields : {
    recipe : {
      type: RecipeInfo,
      description : description['recipeQuery'],
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: () => {
        return {
          
        } 
      }
    } 
  }
});

const modifyRecord = require('./mutations/modify');
const moveToTrashResult = require('./mutations/move_to_trsh');
const deleteRecords = require('./mutations/delete');

const RootMutationType = new GraphQLObjectType({
  name: 'recipeMutation',
  description : description['recipeMutation'],
  fields: () => ({
    modifyRecipesResult: modifyRecord,
    moveRecipesToTrashResult : moveToTrashResult,
    deletedRecipisPermanantResult : deleteRecords,
  })
});


const ncSchema = new GraphQLSchema({
  query : RootQueryType,
  mutation : RootMutationType
});

module.exports = ncSchema;
