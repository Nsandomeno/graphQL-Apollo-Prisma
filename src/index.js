const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const Query = require('./resolvers/Query.js')
const Mutation = require('./resolvers/Mutation.js')
const User = require('./resolvers/User.js')
const Link = require('./resolvers/Link.js')
const Vote = require('./resolvers/Vote.js')
const Subscription = require('./resolvers/Subscription.js')


// let idCount = links.length
const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote,
}

// STEP (3)
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => {
        return {
            ...request,
            prisma,
        } 
    },
})
// - Think of line 30 as server.listen from the curriculum
server.start(() => console.log('The server is running on http://localhost:4000'))