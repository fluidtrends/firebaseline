function join (firebase, args) {
  const primaryKey = Object.keys(args)[0]
  const secondaryKey = Object.keys(args)[1] || primaryKey

  var primaryNode = primaryKey.split("/")[0]
  const secondaryNode = secondaryKey.split("/")[0]

  const primaryValue = Object.keys(args).length > 1 ? args[primaryKey].split(',') : [args[primaryKey].split(",")[0]]
  const secondaryValue = Object.keys(args).length > 1 ? args[secondaryKey].split(',') : [args[primaryKey].split(",")[1]]

  var operations = primaryValue.map(value => functions.retrieve(firebase, primaryKey + "/" + value))
  operations = operations.concat(secondaryValue.map(value => functions.retrieve(firebase, secondaryKey + "/" + value)))

  return Promise.all(operations).
                  then(data => {
                      const primaries = data.slice(0, primaryValue.length)
                      const secondaries = data.slice(primaryValue.length)
                      var updates = {}

                      primaryNode = Array(primaries.length).fill(primaryNode).join("-")
                      primaries.forEach(primary => {
                          secondaries.forEach(sec => {
                              updates['/' + primaryNode + "-" + secondaryNode + "/" + primary._id + "/" + sec._id] = true
                              if (primaryNode === secondaryNode) {
                                  // Also reverse it
                                  updates['/' + primaryNode + "-" + secondaryNode + "/" + sec._id + "/" + primary._id] = true
                              }
                          })
                      })

                      return firebase.database().ref().update(updates)
                  })
}

module.exports = join
