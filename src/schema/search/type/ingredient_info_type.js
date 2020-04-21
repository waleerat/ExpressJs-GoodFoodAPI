const description = require('../../../lib/shema_description'); 

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString
} = require('graphql');
 
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
  }
})