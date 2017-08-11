function retrieve(firebase, args) {
  const key = args.key
  const [node, index, value] = key.split('/')

  if (args.orderBy && args.latest) {
    return firebase.database().ref('/' + node).orderByChild(args.orderBy).once('value').
           then(snapshot => {
               const data = snapshot.val()
               const _id = Object.keys(data)[0]
               return Object.assign({}, data[_id], { _id })
            })
  }

  if (!value) {
      // Get the node by id
      return firebase.database().ref('/' + node + (index ? ("/" + index) : "")).once('value').
             then(snapshot => {
                 const data = snapshot.val()
                 if (index) {
                     return Object.assign({}, data, { _id : index })
                 }
                 if (Array.isArray(data)) {
                   return data
                 }
                 var items = []
                 for (const item in data) {
                   items.push(Object.assign({ _id: item }, data[item]))
                 }
                 return items
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
