const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} = require('graphql');

const description = require('../../../lib/shema_description'); 
const searchModel = require('../../../models/searchModel');
const recipeInfo = require('../type/ingredients_type'); 

const InputType = new GraphQLInputObjectType({
  name: "searchIngredients",
  description: description['SearchIngredients'],
  fields: 
    { 
      ingredientId: { type: GraphQLID  },
      username: { type: GraphQLString  },
      ingredientSlug: { type: GraphQLString  }
    }
});

module.exports = {
  name: "searchResult",
  type: recipeInfo,
  args: {
    key: { type: new GraphQLNonNull(InputType) }
  },
  resolve: (obj, args, { pgPool }) => {
    return searchModel(pgPool).searchIngredients(args.key);
  }
};
