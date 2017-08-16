const retrieve = require('./retrieve')
const update = require('./update')

function join (firebase, allArgs) {

    const args = allArgs.join || allArgs
    const nodeName = allArgs.nodeName
    const original = allArgs.node 

    var ops = []

    var path = ""

    for (const node in args) {
        const data = args[node]

        if ("object" === typeof data) {
            if (Array.isArray(data)) {
                ops = ops.concat(data.map(d => {
                    path = path + (path ? "-" : "") + node
                    return Object.assign({ node }, d)
                }))
            } else {
                path = path + (path ? "-" : "") + node
                ops.push(Object.assign({ node }, data))
            }
        }
    }
    
    if (original) {
        path = `${path}-${nodeName}`
    }

    return Promise.all(ops.map(data => {
        const node = data.node
        delete data.node

        const key = Object.keys(data)[0]
        const value = data[key]
 
        var chain = Promise.resolve({ _id: value })

        if (key !== "id") {
            chain = chain.then(() => retrieve(firebase, { key: node, orderBy: key, equalTo: value }))
        }
        
        return chain.then(item => {
            if (!item._id) { return }
            path = path + "/" + item._id 
            return item
        })
    })).
    then(items => Promise.all([
        update(firebase, { key: path + (original ? "/" + original._id : ""), timestamp: new Date().getTime() })    
        // update(firebase, { key: path2, timestamp: new Date().getTime() })
    ]))
}

module.exports = join
