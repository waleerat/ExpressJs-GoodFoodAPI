const description = require('../../../lib/shema_description'); 
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

const recipesModel = require('../../../models/recipesModel');
const RecipeInfo = require('../type/recipe_info'); 
const inputObject = require('./input_object'); 

GraphQLList

const InputType = new GraphQLInputObjectType({
  name: "inputFields",
  description: description['RecipeNewRecord'],
  fields: { 
            recipe: { type: new GraphQLList(inputObject) }
        }
});

module.exports = {
  type: RecipeInfo,
  description : description['userNewRecode'],
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
  resolve(obj, { input }, { pgPool }) {
    return recipesModel(pgPool).updateRecord(input);
  }
};