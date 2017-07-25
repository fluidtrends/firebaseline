const retrieve = require('./retrieve')

function login (firebase, args) {
  if (!args.email || !args.password) {
    throw new Error("Email and password required")
  }

  return firebase.auth().signInWithEmailAndPassword(args.email, args.password)
}

module.exports = login
