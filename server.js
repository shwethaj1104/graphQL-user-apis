const express= require("express")
const expressGraphQL=require("express-graphql").graphqlHTTP //middleware that wires up express and graphQL
const schema=require('./schema/schema')

const app= express()

//schema is required
app.use("/graphql",expressGraphQL({
    schema,
    graphiql:true
}))

app.listen(4000,()=>{
    console.log("app listening")
})