const {
  GraphQLEnumType
} = require('graphql');

const description = require('../../../lib/shema_description');

module.exports = new GraphQLEnumType({
  name: 'ingredientSearchOption',
  description: description['IngredientSearchOption'],
  values: {
    ingredientId: { value: 'ingredientId' },
    ingredientSlug: { value: 'ingredientSlug' },
    username: { value: 'username' },
    all: { value: 'all' }
  }
});