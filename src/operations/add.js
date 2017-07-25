const join = require('./join')
const create = require('./create')

function add(firebase, args) {
   var original = Object.assign({}, args)
   var keys = []
   var found = false
   Object.keys(args).forEach(key => {
       if (key === 'node' || found) {
           found = true
           return
       }
       keys.push(key)
       delete args[key]
   })

   return create(firebase, args).
          then(node => {
            const joinKeys = { [keys[0]]: original[keys[0]], [args.node]: node._id }
            return join(firebase, joinKeys)
          })
}

module.exports = add
