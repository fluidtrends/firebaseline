function subscribe(firebase, args) {
  const key = args.key
  const [node, index, value] = key.split('/')

  if (!value) {
      // Get the node by id
      firebase.database().ref('/' + node + "/" + index).on('value', snapshot => {
         const data = snapshot.val()
         const result = Object.assign({}, data, { })
         args.onReceivedData(result)
      })
      return
  }

  // Get the node by index
  firebase.database().ref('/' + node).orderByChild(index).equalTo(value).on('value', snapshot => {
     const data = snapshot.val()
     const _id = Object.keys(data)[0]
     const result = Object.assign({}, data[_id], { })
     args.onReceivedData(result)
  })
}

module.exports = subscribe
