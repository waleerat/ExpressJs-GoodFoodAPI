const description = require('../../../lib/shema_description'); 

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} = require('graphql');

 const authorInfo = require('../../share/author_info');

module.exports = new GraphQLObjectType({
  name : 'recipeInfo',
  description : description['recipeInfo'],
  fields: { 
          id: { type: new GraphQLNonNull(GraphQLID)  },
          userId: { type: new GraphQLNonNull(GraphQLID) },
          categoryId: { type: new GraphQLNonNull(GraphQLID) },
          slug: { type: GraphQLString },
          title: { type: GraphQLString },
          description: { type: GraphQLString },
          ingredients: {
            type: new GraphQLList( 
              // ingredient
              new GraphQLObjectType({
                name: 'ingredient',
                fields: () => ({
                  id: { type: new GraphQLNonNull(GraphQLID)  },
                  slug: { type: GraphQLString },
                  title: { type: GraphQLString },
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
                  id: { type: new GraphQLNonNull(GraphQLID)  },
                  order: { type: GraphQLInt },
                  title: { type: GraphQLString },
                  //description : { GraphQLString },
                  remark: { type: GraphQLString }
                  })
              }) 
              // ingredient
            ),
          }, 
          remark: { type: GraphQLString },
          createdBy: {
            type: new GraphQLList(authorInfo)/*  ,
            resolve(obj, args, { loaders }) {
              console.log('++++ Obj userid ++++ : '.obj);
              return loaders.usersByIds.load(obj.userId);
            }  */
          }
  }
})