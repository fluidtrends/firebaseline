function retrieve(firebase, args) {
  var ref = firebase.database().ref(args.key)
  // var byId = (Object.keys(args).length === 1 && args.key.split("/").length === 2)

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

              if (!data || Object.keys(data).length === 0) {
                return []
              }

              data = (data.timestamp ? Object.assign({ _id: snapshot.key }, data) :
                      Object.keys(data).map(_id => Object.assign({ _id }, data[_id])))

              return (data.length === 1 ? data[0] : data)
  })
}

module.exports = retrieve
