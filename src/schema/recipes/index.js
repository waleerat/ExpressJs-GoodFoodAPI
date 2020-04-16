

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
      description : description['rootRecipe'],
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

const newRecord = require('./mutations/add_recipe');
//const updateRecode = require('./mutations/update');

const RootMutationType = new GraphQLObjectType({
  name: 'recipeMutation',
  description : description['RootMutationType'],
  fields: () => ({
    newRecord: newRecord,
    //updateRecodeResult : updateRecode
  })
});


const ncSchema = new GraphQLSchema({
  query : RootQueryType,
  mutation : RootMutationType
});

module.exports = ncSchema;
