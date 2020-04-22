const {
  GraphQLEnumType
} = require('graphql');

const description = require('../../../lib/shema_description');

module.exports = new GraphQLEnumType({
  name: 'categorySearchOption',
  description: description['CategorySearchOption'],
  values: {
    categoryId: { value: 'categoryId' },
    categorySlug: { value: 'categorySlug' },
    username: { value: 'username' }
  }
});