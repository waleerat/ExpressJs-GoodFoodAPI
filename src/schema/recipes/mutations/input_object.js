const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt
  
} = require('graphql');


 
const InputType = new GraphQLInputObjectType({
  name: 'recipeInputInfo',
  fields: { 
    //-----Start-------
    categoryId: { type: new GraphQLNonNull(GraphQLInt)},
    //slug: { type: GraphQLString },
    title: { type: new GraphQLNonNull(GraphQLString)},
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    ingredients: {
      type: new GraphQLList( 
        // ingredient
        new GraphQLInputObjectType({
          name: 'ingredientInput',
          fields: () => ({
            //slug: { type: GraphQLString },
            title: { type: new GraphQLNonNull(GraphQLString) },
            image: { type: GraphQLString },
            amount : { type: new GraphQLNonNull(GraphQLString) },
            remark: { type: GraphQLString }
            })
        }) 
        // ingredient
      ),
    }, 

    howto: {
      type: new GraphQLList( 
        // ingredient
        new GraphQLInputObjectType({
          name: 'stepInput',
          fields: () => ({
            order: { type: new GraphQLNonNull(GraphQLInt) },
            title: { type: new GraphQLNonNull(GraphQLString) },
            image: { type: GraphQLString },
            description : { type: new GraphQLNonNull(GraphQLString) },
            remark: { type: GraphQLString }
            })
        }) 
        // ingredient
      ),
    }, 
 
    remark: { type: GraphQLString }
    //-----End-------
  }
}); 

module.exports = InputType;
 