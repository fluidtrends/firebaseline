function remove(firebase, args) {
    const key = args.key

    return firebase.database().ref().child(args.key).remove()
}

module.exports = remove
