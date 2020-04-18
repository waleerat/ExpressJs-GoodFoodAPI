const description = require('../../../lib/shema_description'); 

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require('graphql');

 const authorInfo = require('../type/author_info');

module.exports = new GraphQLObjectType({
  name : 'ingredientInfo',
  description : description['IngredientInfo'],
  fields: { 
          id: { type: GraphQLID },
          slog: { type: GraphQLString },
          title: { type: GraphQLString },
          description: { type: GraphQLString },
          images : { type: GraphQLString },
          remark: { type: GraphQLString },
          createdBy: { type: new GraphQLList(authorInfo) 
          } 
  }
})