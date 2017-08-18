function update(firebase, args) {
    const key = args.key
    delete args.key

    return firebase.database().ref().child("/" + key).update(args)
}

module.exports = update
