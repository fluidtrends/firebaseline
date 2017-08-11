function update(firebase, args) {
    const key = args.key
    // const [node, index, value] = key.split('/')
    delete args.key

    return firebase.database().ref(key).set(args)

    // if (!value) {
    //     // Get the node by id
    //     return firebase.database().ref('/' + node + (index ? ("/" + index) : "")).once('value').
    //            then(snapshot => Object.keys(snapshot.val())[0]).
    //            then(key => {
    //              console.log(key)
    //            })
    // }
    //
    // // Get the node by id
    // return firebase.database().ref('/' + node).orderByChild(index).equalTo(value).once('value').
    //        then(snapshot => {
    //          const data = snapshot.val()
    //          const key = Object.keys(data)[0]
    //          const values = data[key]
    //          var updates = {}
    //          updates["/" + node + "/" + key] = Object.assign({}, values, args)
    //          return firebase.database().ref().update(updates)
    //        })
}

module.exports = update
