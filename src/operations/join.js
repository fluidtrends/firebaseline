const retrieve = require('./retrieve')

function join (firebase, args) {
  const primaryKey = Object.keys(args)[0]
  const secondaryKey = Object.keys(args)[1] || primaryKey

  var primaryNode = primaryKey.split("/")[0]
  const secondaryNode = secondaryKey.split("/")[0]

  const primaryValue = Object.keys(args).length > 1 ? args[primaryKey].split(',') : [args[primaryKey].split(",")[0]]
  const secondaryValue = Object.keys(args).length > 1 ? args[secondaryKey].split(',') : [args[primaryKey].split(",")[1]]

  var operations = primaryValue.map(value => retrieve(firebase, {key: primaryKey + "/" + value}))
  operations = operations.concat(secondaryValue.map(value => retrieve(firebase, { key: secondaryKey + "/" + value})))

  return Promise.all(operations).
                  then(data => {
                      const primaries = data.slice(0, primaryValue.length)
                      const secondaries = data.slice(primaryValue.length)
                      var updates = {}

                      primaryNode = Array(primaries.length).fill(primaryNode).join("-")
                      const primaryId = primaries.map(p => p._id).join("/")
                      const primaryIdReverse = primaries.reverse().map(p => p._id).join("/")
                      secondaries.forEach(sec => {
                          updates['/' + primaryNode + "-" + secondaryNode + "/" + primaryId + "/" + sec._id] = true
                          if (primaries.length > 1) {
                              // Also reverse it
                              updates['/' + primaryNode + "-" + secondaryNode + "/" + primaryIdReverse + "/" + sec._id] = true
                          }
                      })

                      return firebase.database().ref().update(updates)
                  })
}

module.exports = join
