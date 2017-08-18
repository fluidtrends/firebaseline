const retrieve = require('./retrieve')
const update = require('./update')

function join (firebase, allArgs) {

    const args = allArgs.join || allArgs
    const nodeName = allArgs.nodeName
    const original = allArgs.node

    var ops = []

    var path = ""
    var twinPath = false

    for (const node in args) {
        const data = args[node]

        if ("object" === typeof data) {
            if (Array.isArray(data)) {
                twinPath = true
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
    then(items => {
        var updates = [
            update(firebase, { key: path + (original ? "/" + original._id : ""), timestamp: new Date().getTime() })
        ]
        if (twinPath) {
            const reverseTwinPath = path.split("/").slice(0, -2) + "/" + path.split("/").slice(-2).reverse().join("/")
            updates.push(update(firebase, { key: reverseTwinPath + (original ? "/" + original._id : ""), timestamp: new Date().getTime() }))
        }
        return Promise.all(updates)
    })
}

module.exports = join
