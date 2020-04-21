// Import type helpers from graphql-js
const {
  GraphQLSchema,
  GraphQLObjectType 
} = require('graphql');

const viewRecipes = require('./query/recipes');
const viewCatgories = require('./query/catgories');
// The root query type is where in the data graph
// we can start asking questions
const RootQueryType = new GraphQLObjectType({
  name: 'GoodFoodQuery', 
  fields: () => ({
    viewRecipes: viewRecipes,
    viewCatgories: viewCatgories
  })
});

const ncSchema = new GraphQLSchema({
  query : RootQueryType,
  //mutation : RootMutationType
});
module.exports = ncSchema;
