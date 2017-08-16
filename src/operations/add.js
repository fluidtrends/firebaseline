const join = require('./join')
const create = require('./create')

function add(firebase, args) {
    const joinArgs = args.join
    delete args.join

   return create(firebase, args).
          then(node => join(firebase, Object.assign({ node, nodeName: args.node, join: joinArgs })))
}

module.exports = add
