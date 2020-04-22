const {
  GraphQLSchema,
  GraphQLObjectType 
} = require('graphql');

const description = require('../../lib/shema_description'); 
const viewRecipes = require('./query/recipes');
const viewCatgories = require('./query/catgories');
const viewIngredients = require('./query/ingredients');

const RootQueryType = new GraphQLObjectType({
  name: 'GoodFoodQuery',
  description: description['GoodFoodQuery'], 
  fields: () => ({
    viewRecipes: viewRecipes,
    viewCatgories: viewCatgories,
    viewIngredients: viewIngredients
  })
});

const ncSchema = new GraphQLSchema({
  query : RootQueryType
});
module.exports = ncSchema;