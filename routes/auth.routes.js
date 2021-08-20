const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const router = Router()
const {check, validationResult} = require('express-validator')

router.post('/register',
    [
        check('email', 'некорректный email').isEmail(),
        check('password', 'минимальная длина 3').isLength({min: 6})
        ]
    ,async (req,res)=> {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'ошибка при регистрации'})
        }
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
           return  res.status(400).json({message: 'Такой пользователь уже существует'})
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword})
        await user.save()
        res.status(201).json({message: 'пользователь создан'})


    } catch (e) {
        res.status(500).json({message: 'ошибка при регистрации'})
    }
})
router.post('/login',
    [
        check('email', 'некорректный email').normalizeEmail().isEmail(),
        check('password', 'минимальная длина 3').exists()
    ]
    ,async (req,res)=> {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'ошибка при авторизации'})
        }
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: 'Пользователь не найден'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({message: 'Неверный пароль'})
        }
        const token = jwt.sign(
            {userId: user.id},
            'secret',
            {expiresIn: '1h'}
        )
        res.json({token, userId: user.id})

    } catch (e) {

    }
})

module.exports = router