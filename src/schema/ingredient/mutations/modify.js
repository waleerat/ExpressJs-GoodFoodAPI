const {
  GraphQLInputObjectType,
  GraphQLNonNull
} = require('graphql');

const description = require('../../../lib/shema_description'); 
const util = require('../../../lib/util');
const ingredientsModel = require('../../../models/ingredientsModel');
const IngredientInfo = require('../type/ingredient_info'); 
const inputObject = require('./input_object.js');  

const InputType = new GraphQLInputObjectType({
  name: "inputFields",
  description: description['IngredientModify'],
  fields: 
    { 
      ingredient: { type: new GraphQLNonNull(inputObject) }
    }
}); 

module.exports = {
  type: IngredientInfo,
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
  resolve(obj, { input }, { pgPool }) { 
    if (global.isAuthen){
      return ingredientsModel(pgPool).saveRecord(input);
    } else {
      return util.returnResponseStatusTag(902);
    }
  }
};


 