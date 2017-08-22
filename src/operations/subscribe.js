function subscribe(firebase, args) {
  return new Promise((resolve, reject) => {
    var ref = firebase.database().ref(args.key)

    if (args.orderBy) {
      ref = ref.orderByChild(args.orderBy)
    }

    if (args.limitToLast) {
      ref = ref.limitToLast(Number.parseInt(args.limitToLast))
    }

    ref.on('value', snapshot => {
      const data = snapshot.val()
      args.onReceivedData && args.onReceivedData(Object.assign({ }, data))
    })
    args.onStarted && args.onStarted(ref)
    resolve(ref)
  })
}

module.exports = subscribe
