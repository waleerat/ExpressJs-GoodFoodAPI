

const description = require('../../lib/shema_description'); 

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const RecipeInfo = require('./type/recipe_info'); 

const RootQueryType = new GraphQLObjectType({
  name : "RootQueryType",

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

const newRecord = require('./mutation/add_recipe');
//const updateRecode = require('./mutations/update');

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutation',
  description : description['RootMutationType'],
  fields: () => ({
    newRecodeResult: newRecord,
    //updateRecodeResult : updateRecode
  })
});


const ncSchema = new GraphQLSchema({
  query : RootQueryType,
  mutation : RootMutationType
});

module.exports = ncSchema;
