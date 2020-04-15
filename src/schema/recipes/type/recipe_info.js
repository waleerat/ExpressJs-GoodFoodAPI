const description = require('../../../lib/shema_description'); 

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
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
                name: 'ingredients',
                fields: {  
                    ingredient: { type: new GraphQLList(
                      // ingredient fields
                      new GraphQLObjectType({
                        name: 'ingredient',
                        fields: {  
                            title: { type: new GraphQLNonNull(GraphQLString) },
                            amount : { type: new GraphQLNonNull(GraphQLString) },
                            remark: { type: GraphQLString }
                        }
                      }) 
                       // ingredient fields
                    ) } 
                }
              }) 
              // ingredient
            ),
          },
/*
          howto: {type: new GraphQLList(
            // Steps
            new GraphQLObjectType({
              name: 'Steps',
              fields: {  
                  steps: { type: new GraphQLList(
                    // step
                    new GraphQLObjectType({
                      name: 'step',
                      fields: {  
                          apiKey: { type: new GraphQLNonNull(GraphQLString) },
                          title: { type: new GraphQLNonNull(GraphQLString) },
                          description: { type: GraphQLString }
                      }
                    })
                    // step
                  ) }
              }
            })
            // Steps 
          )}, */
          remark: { type: GraphQLString },
          createdBy: { type: new GraphQLList(authorInfo) 
          } 
  }
})