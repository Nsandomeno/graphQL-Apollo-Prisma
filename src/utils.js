const jwt = require('jsonwebtoken')
const APP_SECRET = 'GraphQL-is-aw3some'

function getUserId(context) {
    const Authorization = context.request.get('Authorization')
    
    if(Authorization) {
        const token = Authorization.replace('Bearer ', '')
        const { userId } = jwt.verify(token, APP_SECRET)
        return userId
    }
    throw new Error('Not authenticated.')
}

module.exports = {
    APP_SECRET,
    getUserId
}

// NOTES:
// - The APP_SECRET is used to sign the JWTs which you're issuing to Users
// - the getUserId function is a middleware that will be called in resolvers...
// - ... which require authentication (ex: post)

// - on post:
//      - (1) retrieves the authorization header that holds the token, from the context argument
//      - (2) verifies the JWT and retrieves the User's ID

