const bcrypt = require('bcryptjs')

module.exports = {
register: async (req, res) => {
    const db = req.app.get('db')
    let {username, password, isAdmin} = req.body
    console.log(req.body)

    let users = await db.get_user(username)
    let user = users[0]

    if (user) {
        return res.status(409).send('User already exists')
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    let result = await db.register_user(isAdmin, username, hash)
    let cUser = result[0]

    req.session.user = cUser
    res.send(req.session.user)
},

login: async (req, res) => {
    const db = req.app.get('db')
    let {username, password} = req.body
    
    let userRes = await db.get_user([username])
    let user = userRes[0]
    console.log(user)
    
    if (!user) {
        return res.status(401).send('Failed to login please check username and password')
    }
    console.log(password, user.password, 'hi')
    const isUser = bcrypt.compareSync(password, user.hash)
    
    
    if (!isUser) {
        return res.status(403).send('Failed to login please check username and password')
    }
    
    delete user.password

    req.session.user = user
    res.send(req.session.user)
},

logout: (req, res) => {
    req.session.destroy()
    res.sendStatus(200)
}
}