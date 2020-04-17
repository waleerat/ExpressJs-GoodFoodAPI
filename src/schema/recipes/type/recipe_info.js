const description = require('../../../lib/shema_description'); 

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} = require('graphql');

 const authorInfo = require('../type/author_info');

module.exports = new GraphQLObjectType({
  name : 'recipeInfo',
  description : description['userRecipeType'],
  fields: { 
          id: { type: GraphQLID },
          slog: { type: GraphQLString },
          title: { type: GraphQLString },
          description: { type: GraphQLString },
          ingredients: {
            type: new GraphQLList( 
              // ingredient
              new GraphQLObjectType({
                name: 'ingredient',
                fields: () => ({
                  //slug: { type: GraphQLString },
                  title: { type: new GraphQLNonNull(GraphQLString) },
                  amount : { type: new GraphQLNonNull(GraphQLString) },
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
                  order: { type: new GraphQLNonNull(GraphQLInt) },
                  title: { type: new GraphQLNonNull(GraphQLString) },
                  description : { type: new GraphQLNonNull(GraphQLString) },
                  remark: { type: GraphQLString }
                  })
              }) 
              // ingredient
            ),
          }, 
          remark: { type: GraphQLString },
          createdBy: { type: new GraphQLList(authorInfo) 
          } 
  }
})