const {
  GraphQLEnumType
} = require('graphql');

const description = require('../../../lib/shema_description');

module.exports = new GraphQLEnumType({
  name: 'recipeSearchOption',
  description: description['RecipeSearchOption'],
  values: {
    recipeId: { value: 'recipeId' },
    username: { value: 'username' },
    recipeSlug: { value: 'recipeSlug' },
    categorySlug: { value: 'categorySlug' },
    ingredientSlug: { value: 'ingredientSlug' }
  }
});