const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

const InputType = new GraphQLInputObjectType({
  name: 'changePassword',
  fields: { 
    //-----Start-------
    title: { type: new GraphQLNonNull(GraphQLString)},
    description: { type: GraphQLString },
    ingredients: {
      type: new GraphQLList( 
        // ingredient
        new GraphQLInputObjectType({
          name: 'inputIngredients',
          fields: {  
              ingredient: { type: new GraphQLList(
                // ingredient fields
                new GraphQLInputObjectType({
                  name: 'inputIngredient',
                  fields: {  
                      title: { type: new GraphQLNonNull(GraphQLString) },
                      amount : { type: new GraphQLNonNull(GraphQLString) },
                      remark: { type: GraphQLString }
                  }
                }) 
                 // ingredient fields
              ) } 
          }
        }) 
        // ingredient
      ),
    }, 
    
    howto: {type: new GraphQLList(
      // Steps
      new GraphQLInputObjectType({
        name: 'steps',
        fields: {  
            steps: { type: new GraphQLList(
              // step fields
              new GraphQLInputObjectType({
                name: 'step',
                fields: {  
                    title: { type: new GraphQLNonNull(GraphQLString) },
                    description : { type: new GraphQLNonNull(GraphQLString) },
                    remark: { type: GraphQLString }
                }
              }) 
              // step fields
            ) } 
        }
      })
      // Steps 
    )},
    remark: { type: GraphQLString }
    //-----End-------
  }
}); 

module.exports = InputType;

