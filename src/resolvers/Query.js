async function feed(root, args, context, info)  {
    const where = args.filter ? {
        OR: [
            { description_contains: args.filter },
            { url_contains: args.filter },
        ],
    } : {}

    const links = await context.prisma.links({
        where,
        skip: args.skip,
        first: args.first,
        orderBy: args.orderBy
    })

    // linksConnection - a query from the prisma client API to retrive the total number of links in the database
    const count = await context.prisma.linksConnection({
        where,
    }).aggregate().count()

    return {
        links,
        count,
    }
}

module.exports = {
    feed,
}