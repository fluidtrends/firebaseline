function retrieve(firebase, args) {
  var ref = firebase.database().ref(args.key)

  if (args.orderBy) {
    ref = ref.orderByChild(args.orderBy)
  }

  if (args.equalTo) {
      ref = ref.equalTo(args.equalTo)
  } else {
    if (args.endAt) {
      ref = ref.endAt(args.endAt)
    }

    if (args.limitToLast) {
      ref = ref.limitToLast(args.limitToLast)
    }
  }


  return ref.once('value').
          then(snapshot => {
              var data = snapshot.val()
              data = Object.keys(data).map(_id => Object.assign({}, data[_id], { _id }))
              return (data.length === 1 ? data[0] : data)
  })
}

module.exports = retrieve
