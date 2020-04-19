const description = require('../../../lib/shema_description');
//const {getResponseStatusTag} = require('../../../lib/util'); 

const {
  GraphQLInputObjectType,
  GraphQLNonNull
} = require('graphql');

const recipesModel = require('../../../models/recipesModel');
const RecipeInfo = require('../type/recipe_info'); 
//const responseStatus = require('../../share/response_status'); 
const inputObject = require('./input_object');  

const InputType = new GraphQLInputObjectType({
  name: "inputFields",
  description: description['RecipeModify'],
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
    /* if (global.isAuthen){
      return recipesModel(pgPool).saveRecord(input);
    }else{
      return getResponseStatusTag(902);
    } */
    return recipesModel(pgPool).saveRecord(input);
  }
};


 