const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} = require('graphql');

const description = require('../../../lib/shema_description'); 
const searchModel = require('../../../models/searchModel');
const recipeInfo = require('../type/categories_type'); 

const InputType = new GraphQLInputObjectType({
  name: "searchCategories",
  description: description['SearchCategories'],
  fields: 
    { 
      categoryId: { type: GraphQLID  },
      username: { type: GraphQLString  },
      categorySlug: { type: GraphQLString  }
    }
});

module.exports = {
  name: "searchResult",
  type: recipeInfo,
  args: {
    key: { type: new GraphQLNonNull(InputType) }
  },
  resolve: (obj, args, { pgPool }) => {
    return searchModel(pgPool).searchCategories(args.key);
  }
};
