const description = require('../../../lib/shema_description'); 
//const usersModel = require('../../../models/usersModel');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  //GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} = require('graphql');

 const authorInfo = require('../../share/author_info');
 //const responseStatus = require('../../share/response_status'); 
module.exports = new GraphQLObjectType( {
  name : 'recipeInfo',
  description : description['recipeInfo'],
  fields: { 
          id: { type: GraphQLID  },
          userId: { type: GraphQLID },
          categoryId: { type: GraphQLID },
          slug: { type: GraphQLString },
          title: { type: GraphQLString },
          description: { type: GraphQLString },
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
                  remark: { type: GraphQLString }
                  })
              }) 
              // ingredient
            ),
          }, 
          remark: { type: GraphQLString },
          createdBy: {
            type: new GraphQLList(authorInfo)/* , 
             resolve(obj, args, { loaders }) {
              //return loaders.usersByIds.load(obj.userId);
              return loaders.usersByIds.load([65]); 
            }   */
          }
  }
})

/* ,
         responseStatus: { type: new GraphQLList(responseStatus) } */
/*resolve(obj, args, { pgPool })  { 
               console.log('resolve function');
              let re = usersModel(pgPool).getUsersById(65);
              console.log(re);
              return re;
            } */
            