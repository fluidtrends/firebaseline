function create(firebase, args) {
    // Create an empty node
    const _id = args.id || firebase.database().ref().child(args.node).push().key

    // Extract the data
    var data = Object.assign({}, args)
    delete data.node

    // Inject creation timestamp
    data.timestamp = data.timestamp || new Date().getTime()

    // Create the content
    var updates = {}
    updates[args.node + "/" + _id] = data

    // Submit the data
    return firebase.database().ref().update(updates).then(() => Object.assign({}, data, { _id }))
}

module.exports = create
