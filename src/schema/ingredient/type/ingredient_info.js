const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull
  
} = require('graphql');

const description = require('../../../lib/shema_description'); 
const authorInfo = require('../../share/author_info');
const responseStatusTag = require('../../share/response_status');
 
module.exports = new GraphQLObjectType({
  name : 'ingredientInfo',
  description : description['IngredientInfo'],
  fields: { 
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    slug: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    image : { type: GraphQLString },
    remark: { type: GraphQLString },
    createdBy: { type: new GraphQLNonNull(authorInfo),
    responseStatus: { type: new GraphQLNonNull(responseStatusTag) }
    } 
  }
})