function unsubscribe(firebase, args) {
  return firebase.database().ref(args.key).off("value")
}

module.exports = unsubscribe
