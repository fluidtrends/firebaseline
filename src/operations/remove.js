function remove(firebase, args) {
    const key = args.key

    return new Promise((resolve, reject) => {
      firebase.database().ref().child(args.key).remove((error) => {
        if (error) {
          reject(error)
          return
        }
        resolve()
      })
    })
}

module.exports = remove
