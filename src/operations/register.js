const login = require('./login')

function register (firebase, args) {
  const password = args.password
  const email = args.email
  delete args.password

  var creation = Promise.resolve()
  if (args.appAuth) {
    return firebase.auth().createUserWithEmailAndPassword(args.email, password)
            .then(user => firebase.database().ref('users/' + user.uid).set(Object.assign({
              timestamp: new Date().getTime()
            }, args)))
  }

  return firebase.auth().createUser({
    email,
    emailVerified: false,
    password: password,
    disabled: false
  })
  .then(user => firebase.database().ref('users/' + user.uid).set(Object.assign({
    timestamp: new Date().getTime()
  }, args)))
  .then(() => login(firebase, { email, password }))
}

module.exports = register
