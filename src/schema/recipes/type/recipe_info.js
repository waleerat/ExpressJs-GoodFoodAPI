const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} = require('graphql');

const description = require('../../../lib/shema_description');
const authorInfo = require('../../share/author_info');
const responseStatusTag = require('../../share/response_status'); 

module.exports = new GraphQLObjectType( {
  name : 'recipeInfo',
  description : description['RecipeInfo'],
  fields: { 
    id: { type: GraphQLID  },
    userId: { type: GraphQLID },
    slug: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    category: {
      type: new GraphQLNonNull( 
        new GraphQLObjectType({
          name: 'category',
          fields:  {
            id: { type: GraphQLID  },
            slug: { type: GraphQLString },
            title: { type: GraphQLString },
            description : { type: GraphQLString },
            image: { type: GraphQLString }
          }
        }) 
      ),
    }, 
    ingredients: {
      type: new GraphQLList( 
        new GraphQLObjectType({
          name: 'ingredient',
          fields: () => ({
            id: { type: GraphQLID  },
            slug: { type: GraphQLString },
            title: { type: GraphQLString },
            description : { type: GraphQLString },
            image: { type: GraphQLString },
            amount : { type: GraphQLString },
            remark: { type: GraphQLString }
            })
        }) 
      ),
    }, 
    howto: {
      type: new GraphQLList( 
        new GraphQLObjectType({
          name: 'step',
          fields: () => ({
            id: { type: GraphQLID  },
            orderStep: { type: GraphQLInt },
            title: { type: GraphQLString },
            description : { type: GraphQLString },
            image: { type: GraphQLString },
            remark: { type: GraphQLString }
            })
        }) 
      ),
    }, 
    remark: { type: GraphQLString },
    createdBy: {type: new GraphQLNonNull(authorInfo) },
    responseStatus: { type: new GraphQLNonNull(responseStatusTag)} 
  }
});