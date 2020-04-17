const description = require('../../../lib/shema_description'); 
const {
  GraphQLInputObjectType,
  GraphQLNonNull
} = require('graphql');

const recipesModel = require('../../../models/recipesModel');
const RecipeInfo = require('../type/recipe_info'); 
const inputObject = require('./input_object');  

const InputType = new GraphQLInputObjectType({
  name: "inputFields",
  description: description['RecipeModifyRecord'],
  fields: 
    { 
      recipe: { type: new GraphQLNonNull(inputObject) }
    }
});

module.exports = {
  type: RecipeInfo,
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
  resolve(obj, { input }, { pgPool }) {
    return recipesModel(pgPool).saveRecord(input);
  }
};


 