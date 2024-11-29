const express= require("express")
const expressGraphQL=require("express-graphql").graphqlHTTP 
const schema=require('./schema/schema')

const app= express()

//midddle that wires up express and graphQL
app.use("/graphql",expressGraphQL({
    schema,
    graphiql:true
}))

//app server
app.listen(4000,()=>{
    console.log("app listening")
})