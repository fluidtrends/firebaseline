function register(firebase, args) {

  var creation = Promise.resolve()
  if (args.appAuth) {
    return firebase.auth().createUserWithEmailAndPassword(args.email, args.password).
            then(user => firebase.database().ref('users/' + user.uid).set(Object.assign({
              timestamp: new Date().getTime()
            }, args)))
  }


  return firebase.auth().createUser({
        email: args.email,
        emailVerified: true,
        password: args.password,
        displayName: args.name,
        disabled: false }).
    then(user => firebase.database().ref('users/' + user.uid).set(Object.assign({
      timestamp: new Date().getTime()
    }, args)))

}

module.exports = register
