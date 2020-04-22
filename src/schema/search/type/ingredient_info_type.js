const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const description = require('../../../lib/shema_description'); 
const authorInfo = require('../../share/author_info');

module.exports = new GraphQLObjectType({
  name : 'ingredientInfo',
  description : description['IngredientInfo'],
  fields: { 
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    slug: { type: GraphQLString },
    title: { type: GraphQLString },
    amount: { type: GraphQLString },
    description: { type: GraphQLString },
    image : { type: GraphQLString },
    remark: { type: GraphQLString },
    createdBy: {type: new GraphQLNonNull(authorInfo),
      resolve(obj, args, { loaders }) { 
        return loaders.usersByIds.load(obj.userId);
      }
    },
  }
})