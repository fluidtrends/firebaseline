function retrieve(firebase, args) {
  var ref = firebase.database().ref(args.key)
  var byId = true

  if (args.orderBy) {
    byId = false
    ref = ref.orderByChild(args.orderBy)
  }

  if (args.equalTo) {
      byId = false
      ref = ref.equalTo(args.equalTo)
  } else {
    if (args.endAt) {
      byId = false
      ref = ref.endAt(args.endAt)
    }

    if (args.limitToLast) {
      byId = false
      ref = ref.limitToLast(args.limitToLast)
    }
  }

  return ref.once('value').
          then(snapshot => {
              var data = snapshot.val()

              if (byId) {
                return Object.assign({}, data, { _id:  args.key.split("/").slice(-1)[0] })
              }

              data = Object.keys(data).map(key => {
                return Object.assign({}, data[key], { _id: key })
              })

              return (data.length === 1 ? data[0] : data)
  })
}

module.exports = retrieve
