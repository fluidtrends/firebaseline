const retrieve = require('./retrieve')

function login (firebase, args) {
  if (!args.email || !args.password) {
    throw new Error('Email and password required')
  }

  return firebase.auth().signInWithEmailAndPassword(args.email, args.password)
          .then((user) => user.toJSON())
          .then((user) => retrieve(firebase, { key: `users/${user.uid}` }).then((profile) => Object.assign({}, user, profile)))
}

module.exports = login
