const description = require('../../../lib/shema_description'); 
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} = require('graphql');

const recipeInfo = require('../../recipes/type/recipe_info');
const InputType = new GraphQLInputObjectType({
  name: "searchCategories",
  description: description['ingredientDelete'],
  fields: 
    { 
      id: { type: GraphQLID  }
    }
});

module.exports = {
  name: "searchResult",
  type: recipeInfo,
  args: {
    key: { type: new GraphQLNonNull(InputType) }
  },
  resolve: (obj, args, { loaders }) => {
    return loaders.RecipeByRecipeIds.load(args.key);
  }
};