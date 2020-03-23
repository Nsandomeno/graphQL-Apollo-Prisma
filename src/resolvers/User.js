// resolver for the Links field on the User type

function links(parent, args, context) {
    return context.prisma.user({ id: parent.id }).links()
}

module.exports = {
    links,
}
