// the resolver for the 'postedBy' field on the type 'Link'

function postedBy(parent, args, context) {
    return context.prisma.link({ id: parent.id }).postedBy()
}

// When a new relationship is created between types, as in the case with Votes...
// ... we also need to modify the relatonship resolvers
function votes(parent, args, context) {
    return context.prisma.link({ id: parent.id }).votes()
} 
module.exports = {
    postedBy,
    votes,
}

// NOTES:

// (1) - fetching the Link using the prisma client instance
// (2) - invoking postedBy() on it

// - the resolver MUST be called postedBy because it resolves the postedBy field from the Link...
// - ...type in schema.graphql