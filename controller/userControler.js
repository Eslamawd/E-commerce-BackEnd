const User = require('../models/User')
const Prodact = require('../models/Prodact')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const getAllUsers = async(req, res) => {


    const user = await User.find().select('-password').lean()
    
    
    if (!user) {
            return res.status(400).json({message:' not user found'})
    } 
        else   res.json(user)
    

}

const getUser = async(req, res) => {

    const user = await User.findById(req.params.id).select('-password').lean()

    if (!user) {
        return res.status(400).json({message:' not user found'})
} 
    else {
          res.json(user)

    }

}


const createNewUser = async(req, res) => {


    const { username, firstname, lastname, password, numberphone, roles } = req.body


    if(!username || !password || !firstname
    || !lastname
    || !numberphone|| !roles) 
    {
        return res.status(400).json({message: 'ALL fields are required'})

    }


    try {
    const duplicate = await User.findOne({ username, numberphone }).lean().exec()

    if (duplicate) {
        return res.status(409).json({message:'duplicate user pleace reteurn new user name'})
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = { username, "password": hashedPwd, firstname, lastname, numberphone, roles}

    const user = await User.create(userObject)

       
    const roles = Object.values(user.roles)

        const accessToken = jwt.sign(
            {"UserInfo": {
                    "id": foundUser._id,
                  "username": foundUser.username,
                    "roles": roles
        }}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})


        const refreshToken = jwt.sign(
            { "username": user.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}

        )
  
      
        
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        //


        res.json({ accessToken })
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }

    

}


const updateUser = async(req, res) => {



const { id, username, firstname, lastname, password, roles, numberphone, active } = req.body

    if (!id || !username || !roles || typeof active !=='boolean') {
        return res.status(400).json({message:'all fields are required'})

    }

    const user = await User.findById(id).exec()
    if (!user) {
    return res.status(400).json({message:'user not found'})
    }

    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Doplicate user name'})
    }

    user.firstname = firstname
    user.lastname = lastname
    user.numberphone = numberphone
    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }
    const updatedUser = await user.save()
    res.json({message: `${updatedUser.username}uptedd`})
}


const deleteUser = async (req, res) => {

    const { id } = req.body
    
    if (!id) {
        return res.status(400).json({message: 'user id required'})
    }

    const Prodacts = await Prodact.findOne({user: id }).lean().exec()
    if (Prodacts?.length) {
        return res.status(400).json({message: 'user has assigned Prodacts'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message: 'user not found'})
    }

    const result = await user.deleteOne()
    const replay = `username ${result.username} with id ${result.id}deleted`
    res.json(replay)



}




module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
}
