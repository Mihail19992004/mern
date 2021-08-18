const {Router} = require('express')

const router = Router()

router.post('/register', async (req,res)=> {
    try {
        const {email, password} = req.body

    } catch (e) {
        res.status(500).json({message: 'ошибка при регистрации'})
    }
})
router.post('/login', async (req,res)=> {
    try {

    } catch (e) {

    }
})

module.exports = router