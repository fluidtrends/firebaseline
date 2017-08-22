const retrieve = require('./retrieve')
const update = require('./update')

function join (firebase, allArgs) {
    const nodeName = allArgs.nodeName
    const original = allArgs.node

    const args = Object.assign({}, allArgs.join || allArgs)
    const filter = args.filter
    const afterFilter = (filter && filter.after ? new Date(filter.after).getTime() : undefined)
    const beforeFilter = (filter && filter.before ? new Date(filter.before).getTime() : undefined)

    delete args.filter

    var ops = []

    var path = ""
    var twinPath = false

    for (const node in args) {
        const data = args[node]
        if ("object" === typeof data) {
            if (Array.isArray(data) && data.length > 1) {
                twinPath = true
                ops = ops.concat(data.map(d => {
                    return Object.assign({ node }, d)
                }))
                path = `${node}-${node}`
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
            if (!item._id) {
              return
            }
            return item
        })
    })).
    then(items => {
        const timestamp = (original && original.timestamp ? original.timestamp : new Date().getTime())
        if (afterFilter && timestamp <= afterFilter) {
          return Promise.resolve()
        }

        if (!twinPath) {
          const updatePath = path + "/" + items[0]._id + (items.length > 1 ? "/" + items[1]._id : "") + (original ? "/" + original._id : "")
          return update(firebase, { key: updatePath, timestamp })
        }

        var updates = []

        items.forEach(item => {
          items.forEach(item2 => {
            if (item._id === item2._id) { return }
            const updatePath = path + "/" + item._id + "/" + item2._id + (original ? "/" + original._id : "")
            updates.push(update(firebase, { key: updatePath, timestamp }))
          })
        })

        return Promise.all(updates)
    })
}

module.exports = join
