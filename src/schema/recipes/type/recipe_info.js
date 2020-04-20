const description = require('../../../lib/shema_description'); 

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  //GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} = require('graphql');

 const authorInfo = require('../../share/author_info');
 const responseStatus = require('../../share/response_status'); 
module.exports = new GraphQLObjectType( {
  name : 'recipeInfo',
  description : description['recipeInfo'],
  fields: { 
          id: { type: GraphQLID  },
          userId: { type: GraphQLID },
          slug: { type: GraphQLString },
          title: { type: GraphQLString },
          description: { type: GraphQLString },
          image: { type: GraphQLString },
          category: {
            type: new GraphQLList( 
              // ingredient
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
              // ingredient
            ),
          }, 
          ingredients: {
            type: new GraphQLList( 
              // ingredient
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
              // ingredient
            ),
          }, 
      
          howto: {
            type: new GraphQLList( 
              // ingredient
              new GraphQLObjectType({
                name: 'step',
                fields: () => ({
                  id: { type: GraphQLID  },
                  order: { type: GraphQLInt },
                  title: { type: GraphQLString },
                  description : { type: GraphQLString },
                  image: { type: GraphQLString },
                  remark: { type: GraphQLString }
                  })
              }) 
              // ingredient
            ),
          }, 
          remark: { type: GraphQLString },
          createdBy: {type: new GraphQLList(authorInfo) },
          responseStatus: { type: new GraphQLList(responseStatus)} 
  }
});