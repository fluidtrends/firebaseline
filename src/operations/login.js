const retrieve = require('./retrieve')

function login (firebase, args) {
  if (!args.email || !args.password) {
    throw new Error('Email and password required')
  }

  return firebase.auth().signInWithEmailAndPassword(args.email, args.password)
          .then((user) => user.toJSON())
          .then((user) => retrieve({ key: `users/${user.uid}` }).then((profile) => ({ user, profile })))
}

module.exports = login
