function retrieve(firebase, args) {
  var ref = firebase.database().ref(args.key)
  var filter = []
  var fields = args.fields

  if (args.filter && Array.isArray(args.filter)) {
    filter = filter.concat(args.filter)
  }

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
      ref = ref.limitToLast(Number.parseInt(args.limitToLast))
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

              data = data.map(item => Object.keys(item).filter(k => {
                return !filter.includes(k) && (!fields || fields.includes(k))
              }).reduce((obj, key) => {
                  obj[key] = item[key]
                  return obj
              }, {}))

              return (data.length === 1 ? data[0] : data)
  })
}

module.exports = retrieve
