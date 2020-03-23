const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')


function post(parent, args, context, info) {
    // 1 - using the getUserId middleware function to retrieve the id of the user
    // - this id is stored at the Authorization Header on the incoming HTTP request
    const userId = getUserId(context)
    // 2 - you are using the userId to 'connect' the Link being created to...
    // - the user that created it
    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        // the value on line 16 is called a 'nested object write'
        // the connect function ties the post to the user whose id was fetched in Step 1
        postedBy: { connect: { id: userId }},
    })
}

async function signup(parent, args, context, info) {
    // 1 - encrypting the User's password using bcrypt
    const password = await bcrypt.hash(args.password, 10)
    // 2 - use the prisma client instance to store the new User in the database
    const user = await context.prisma.createUser({ ...args, password })
    // 3 - generating a JWT which is signed with an APP_SECRET
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    // 4 - return the token and user in an object that adheres...
    //   - ... to the shape of the AuthPayload object from our schema
    return {
        token,
        user,
    }
}

async function login(parent, args, context, info) {
    // 1 - instead of creating a new User, we are using prisma client to...
    //   - ... retrive an existing User record by the email property
    const user = await context.prisma.user({ email: args.email })
    if (!user) {
        throw new Error('No such user found.')
    }

    // 2 - comaparing the password with the one stored in the database
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid credentials.')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    // 3 - returning the token and user agains as defined by AuthPayload 
    //   - ... in our schema
    return {
        token,
        user,
    }
}

async function vote(parent, args, context, info) {
    // 1 - validate the incoming JWT with getUserId util
    const userId = getUserId(context)

    // 2 - $exists function takes a 'where' filter object...
    //   - ...that allows you to specify certain conditions...
    //   - ...about the elements of that type

    //   - If the condition applies to at leat one element in the database...
    //   - ...the $exists function returns true

    //   - In this case:
    // - We are using $exists to verify that the requesting user...
    // - ...has not yet voted for the link thats identified by ars.linkId
    // - If $exists returns false, method sends the new vote...
    // - This new vote is connected to the user and the link
    const voteExists = await context.prisma.$exists.vote({
        user: { id: userId },
        link: { id: args.linkId },
    })
    // 3
    if (voteExists) {
        throw new Error(`Already voted for this link: ${args.linkId}`)
    }
    // 4
    return context.prisma.createVote({
        user: { connect: { id: userId } },
        link: { connect: { id: args.linkId } },
    })
}

module.exports = {
    signup,
    login,
    post,
    vote,
}