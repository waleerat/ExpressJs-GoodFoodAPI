const description = require('../../../lib/shema_description'); 
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  //GraphQLString,
  GraphQLID
} = require('graphql');

const recipeInfo = require('../type/recipes_info_type');
const InputType = new GraphQLInputObjectType({
  name: "searchRecipes",
  description: description['searchRecipes'],
  fields: 
    { 
      id: { type: GraphQLID  }
    }
});

module.exports = {
  name: "searchResult",
  type: recipeInfo,
  args: {
    key: { type: new GraphQLNonNull(InputType) }
  },
  resolve: (obj, args, { loaders }) => {
    return loaders.recipeByIds.load(args.key.id); 
  }
};