const description = require('../../../lib/shema_description'); 

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  //GraphQLNonNull,
 // GraphQLList
} = require('graphql');

//const ingredientsListInfo = require('./ingredient_list_info');
//const howtoInfo = require('./howto_info');
//const userInfo = require('../../users/type/user_info');

module.exports = new GraphQLObjectType({
  name : 'RecipeType',
  description : description['userRecipeType'],
  fields: { 
          id: { type: GraphQLID },
          slog: { type: GraphQLString },
          title: { type: GraphQLString },
          description: { type: GraphQLString },
          /*ingredients: {
            type: new GraphQLList(ingredientsListInfo),
            resolve(obj, args, { loaders }) {
              return loaders.ingredientsByRecipeIds.load(obj.id);
            }
          }, 
          howto: {
            type: new GraphQLList(howtoInfo),
            resolve(obj, args, { loaders }) {
              return loaders.howtoByRecipeIds.load(obj.id);
            }
          },
          remark: { type: GraphQLString },
          creareDate: { type: GraphQLString },
          createdBy: {
            type: new GraphQLNonNull(userInfo),
            resolve(obj, args, { loaders }) {
              return loaders.usersByIds.load(obj.userId);
            }
          }, */
  }
})