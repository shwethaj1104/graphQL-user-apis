const graphql=require('graphql')
const axios=require("axios")

//EXTERNAL SERVER TO RETURN DATA
// https://github.com/typicode/json-server/tree/v0

const {GraphQLObjectType,GraphQLString,GraphQLInt,
    GraphQLSchema //takes in a root query and return a graph ql schema instance
    ,GraphQLList,
    GraphQLNonNull //makes the respective field required while mutating
}=graphql

//HARDCODING DATA
//lodash is a helper library, which helps us to walk through the collections of data and work through it
// const _=require('lodash')
// const users=[
//     {id:'23',firstName:'Bill',lastName:'Gates',age:"40"},
//     {id:'53',firstName:'Samantha',lastName:'John',age:"46"}
// ]

const CompantType=new GraphQLObjectType({
    name:'Company',
    fields: () => ({ //we are adding arrow function to overcome cross dependency of userType and companyType, which allows us to take advantage of closures
        //which means, the function gets defined but does not gets executed, untill the entire file is defined, so we will have referece to both userTpe and companytype while executing
        id:{type:graphql.GraphQLString},
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        // users:{
        //     type:new GraphQLList(UserType),
        //     resolve(parentvalue,args){
        //         return axios.get(`http://localhost:3000/companies/${parentvalue?.id}/users`).then(res=>res.data)
        //     }
        // }
    })
})

const UserType=new GraphQLObjectType({
    name:'User',
    fields: () => ({
        id:{type:graphql.GraphQLString},
        firstName:{type:GraphQLString},
        lastName:{type:GraphQLString},
        age:{type:graphql.GraphQLInt},
        company:{
            type:CompantType,
            resolve(parentvalue,args){
                return axios.get(`http://localhost:3000/companies/${parentvalue?.companyId}`).then(res=>res.data)
                console.log("resolve--",parentvalue,args)
            }
        }
    })
})

//main purpose of rootQuery is to allow graphQL to jump and land on the specific node in the graph of all of our data 
//resolve is to resolve the query, like going in to DB and looking for what is asked

const RootQuery=new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        user:{
            type:UserType,
            args:{id:{type:GraphQLString}},
                resolve(parentvalue,args){
                    // return _.find(users,{id:args.id})
                    return axios.get(`http://localhost:3000/users/${args.id}`).then(res=>res.data)
                }
        },
        company:{
            type:CompantType,
            args:{id:{type:GraphQLString}},
            resolve(parentvalue,args){
                return axios.get(`http://localhost:3000/companies/${args.id}`).then(res=>res.data)
            }
        }
    }
})
//Mutations are used to change the underlying data
const mutation=new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addUser:{
            type:UserType, //type of data we are returning, and it is not what type we are working with
            args:{
                firstName:{type:new GraphQLNonNull(GraphQLString)},//REQUIRED
                lastName:{type:GraphQLString},
                age:{type:new GraphQLNonNull(GraphQLInt)},//REQUIRED
                companyId:{type:GraphQLString}
            },
            resolve(parentValue,{firstName,age}){
                return axios.post('http://localhost:3000/users',{firstName,age}).then(res=>res.data)
            }
        },
        deleteUser:{
            type:UserType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue,{id}){
                return axios.delete(`http://localhost:3000/users/${id}`).then(res=>res.data)
            }
        },
        editUser:{
            type:UserType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)},
                firstName:{type:GraphQLString},
                lastName:{type:GraphQLString},
                age:{type:GraphQLInt},
                companyId:{type:GraphQLString}
            },
            resolve(parentValue,args){
                return axios.patch(`http://localhost:3000/users/${args.id}`,args).then(res=>res.data)
            }
        }
    }
})

module.exports =new GraphQLSchema({
    query:RootQuery,
    mutation
})