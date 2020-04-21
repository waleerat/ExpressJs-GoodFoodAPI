const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLID
} = require('graphql');

const searchModel = require('../../../models/searchModel');
const authorInfo = require('../../share/author_info');
const responseStatus = require('../../share/response_status');
const catgoryInfo = require('../type/category_info_type');
const ingredientInfo = require('../type/ingredient_info_type');
const howtoInfo = require('./howto_info_type');

module.exports = new GraphQLObjectType({
  name: 'userInfo', 
  fields: () => ({
    id: { type: GraphQLID  },
    userId: { type: GraphQLID },
    slug: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    remark: { type: GraphQLString },
    category: { type: new GraphQLNonNull(catgoryInfo),
      resolve(obj, args, { loaders }) {
        return loaders.categoryByIds.load(obj.categoryId);
      }
     }, 
    ingredients: { type: new GraphQLList(ingredientInfo),
      resolve(obj, args, { pgPool }) {  
        return searchModel(pgPool).getIngredientByRecipeId(obj.id); 
      }
    }, 
    howto: { type: new GraphQLList(howtoInfo),
      resolve(obj, args, { pgPool }) {  
        return searchModel(pgPool).getHowtoByRecipeId(obj.id); 
        //return loaders.howtoByRecipeIds.load(obj.id);
      }
    },  
    createdBy: {type: new GraphQLNonNull(authorInfo),
      resolve(obj, args, { loaders }) { 
        return loaders.usersByIds.load(obj.userId);
      }
    },
    responseStatus: { type: new GraphQLList(responseStatus)} 
  })
});