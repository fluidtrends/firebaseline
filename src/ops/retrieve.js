function retrieve(firebase, args) {
  const key = args[0]
  const [node, index, value] = key.split('/')
  if (!value) {
      // Get the node by id
      return firebase.database().ref('/' + node + "/" + index).once('value').
             then(snapshot => {
                 const data = snapshot.val()
                 return Object.assign({}, data, { _id : index })
              })
  }

  // Get the node by index
  return firebase.database().ref('/' + node).orderByChild(index).equalTo(value).once('value').
         then(snapshot => {
             const data = snapshot.val()
             const _id = Object.keys(data)[0]
             return Object.assign({}, data[_id], { _id })
          })
}

module.exports = retrieve
