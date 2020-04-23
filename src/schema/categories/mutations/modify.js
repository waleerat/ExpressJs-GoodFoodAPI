const {
  GraphQLInputObjectType,
  GraphQLNonNull
} = require('graphql');

const description = require('../../../lib/shema_description');
const util = require('../../../lib/util'); 
const categoriesModel = require('../../../models/categoriesModel');
const CategoryInfo = require('../type/category_info'); 
const inputObject = require('./input_object.js');  

const InputType = new GraphQLInputObjectType({
  name: "inputFields",
  description: description['CategoriesModify'],
  fields: 
    { 
      category: { type: new GraphQLNonNull(inputObject) }
    }
}); 

module.exports = {
  type: CategoryInfo,
  args: {
    input: { type: new GraphQLNonNull(InputType) }
  },
  resolve(obj, { input }, { pgPool }) { 
    if (global.isAuthen){
      return categoriesModel(pgPool).saveRecord(input);
    } else {
      return util.returnResponseStatusTag(902);
    }
  }
};


 