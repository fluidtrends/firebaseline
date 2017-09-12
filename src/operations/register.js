function register(firebase, args) {

  var creation = Promise.resolve()

  if (args.appAuth) {
    creation = firebase.auth().createUserWithEmailAndPassword(args.email, args.password)
  } else {
    create = firebase.auth().createUser({
        email: args.email,
        emailVerified: true,
        password: args.password,
        displayName: args.name,
        disabled: false
    })
  }

  return creation.then(user => firebase.database().ref('users/' + user.uid).set({
      email: args.email,
      name: args.name,
      timestamp: new Date().getTime()
    }))
}

module.exports = register
