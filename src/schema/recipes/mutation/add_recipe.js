const description = require('../../../lib/shema_description'); 
const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

const recipesModel = require('../../../models/recipesModel')
const RecipeInfo = require('../type/recipe_info'); 
const ingredientsListInfo = require('../type/ingredient_list_info');
const howtoInfo = require('../type/howto_info');

const InputType = new GraphQLInputObjectType({
  name: "newRecord",
  description: description['RecipeNewRecord'],
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString)},
    description: { type: GraphQLString },
    ingredients: {type: new GraphQLList(ingredientsListInfo)}, 
    howto: {type: new GraphQLList(howtoInfo)},
    remark: { type: GraphQLString }
  }
});

module.exports = {
  type: RecipeInfo,
  description : description['userNewRecode'],
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
  resolve(obj, { input }, { pgPool }) {
    return recipesModel(pgPool).addNewRecord(input);
  }
};