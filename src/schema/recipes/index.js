

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
const updateStatusResult = require('./mutations/update_status');
const deleteRecords = require('./mutations/delete');

const RootMutationType = new GraphQLObjectType({
  name: 'recipeMutation',
  description : description['recipeMutation'],
  fields: () => ({
    modifyResult: modifyRecord,
    updateStatusResult : updateStatusResult,
    deleteResult : deleteRecords,
  })
});


const ncSchema = new GraphQLSchema({
  query : RootQueryType,
  mutation : RootMutationType
});

module.exports = ncSchema;
