const retrieve = require('./retrieve')

function reset (firebase, args) {
  if (!args.email) {
    throw new Error("Email required")
  }

  return firebase.auth().sendPasswordResetEmail(args.email)
}

module.exports = reset
