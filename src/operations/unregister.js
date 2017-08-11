function unregister(firebase, args) {

  if (!args.id) {
    throw new Error("User id required")
  }

  // Get the node by index
  return firebase.auth().deleteUser(args.id)
}

module.exports = unregister
