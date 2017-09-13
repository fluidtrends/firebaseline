function store(firebase, args) {
    const ref = firebase.storage().ref().child(args.key)
    var meta = {}

    if (args.contentType) {
      meta.contentType = args.contentType
    }

    return ref.putString(args.data, 'base64').then(d => {
      console.log("!!!!", d)
      return d
    }).catch(e => console.log(e))
}

module.exports = store
