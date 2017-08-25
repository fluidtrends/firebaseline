function register(firebase, args) {

  return firebase.auth().createUser({
      email: args.email,
      emailVerified: true,
      password: args.password,
      displayName: args.name,
      disabled: false
    }).
    then(user => firebase.database().ref('users/' + user.uid).set({
      email: args.email,
      name: args.name,
      timestamp: new Date().getTime()
    }))
}

module.exports = register
