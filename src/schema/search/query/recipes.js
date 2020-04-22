const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} = require('graphql');

const description = require('../../../lib/shema_description'); 
const searchModel = require('../../../models/searchModel');
const recipeInfo = require('../type/recipes_type'); 
const searchOption = require('../type/recipe_search_option_type');
 

const InputType = new GraphQLInputObjectType({
  name: "searchRecipes",
  description: description['SearchRecipes'],
  fields: 
    { 
      page: { type: GraphQLID  },
      limit: { type: GraphQLID  },
      searchOption: { type: new GraphQLNonNull(searchOption) },
      searchKey: { type: GraphQLString  }
    }
});

module.exports = {
  name: "searchResult",
  type: recipeInfo,
  args: {
    key: { type: new GraphQLNonNull(InputType) }
  },
  resolve: (obj, args, { pgPool }) => {
    return searchModel(pgPool).searchRecipes(args.key);
  }
};
