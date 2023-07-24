const User = require('../models/User')
const Prodact = require('../models/Prodact')
const Cart = require('../models/CartUser')
const { json } = require('express')



const lastManth = new Date()
lastManth.setMonth(lastManth.getMonth() - 6)


// My buyer

const getAllCartByer = async(req, res) => {

    const { id } = req.body

   if(!id) return res.status(401).json({message: "Not found prodact"}) 
try {
    
    const cart = Cart.find({ Buyer: id })
    .populate('prodact')
    .exec((err, cart) => {
        if(err){
            console.log(err)
        }
        else{
            Prodact.findById(cart.prodact._id)
    .populate('user').select(-'password')
    .exec((err, pro) => {
        if(err){
            console.log(err)
        }
        else{
            const soo = pro.user
  res.json(pro)
        }
    })
        }
    })
} catch (error) {
    
    console.log(error)
}




   // const tager = User.findById(cart.user)
    //console.log(tager)

   /* const cartWithUser = await Promise.all(cart.map(async(car) => {

        const dee = await Prodact.find({_id: car.prodact})

    
        return {...dee }
    }))
    
        const cartWith = await Promise.all(cartWithUser.map(async(car) => {

        const roo = await User.find({_id: car.user})

        return {roo}
        }))
    


       console.log(cart)
       if (!cart?.length) {
           return res.status(400).json({ message:'no prodauct found'})
        }
         
      else {
    
    res.json({...cartWithUser, cartWith})
}
*/


}


// My sales

const getAllCartUser = async(req, res) => {
        
        const { user } = req.body

    
        if(!user) return res.status(401).json({message: "Not found prodact"}) 

 
        const prodact = Prodact.find({user: user})
    
        try {
    
            const cart = Cart.findById({prodact: prodact})
            .populate('Buyer')
            .exec((err, cart) => {
                if(err){
                    console.log(err)
                }
                else{
                            User.findById(cart.Buyer)
                            .exec((err, pro) => {
                             if(err){
                             console.log(err)
                             }
                             else{
                               res.json(pro)
                             }
                            })
                }
            })
        } catch (error) {
            
            console.log(error)
        }

       /* const prodact =  await Prodact.findOne({user: user}).lean()

        const cart =  await Cart.find({prodact: prodact._id}).lean()
console.log(cart)
        if (!cart) {
            return res.status(400).json({ message:'no prodauct found'})
        }

    
        const cartWithUser = await Promise.all(cart.map(async(car) =>{

            const BEE =  await User.findOne({_id: car.Buyer}).lean()
            const dee = await Prodact.findOne({_id: car.prodact}).lean()

    
            return { ...dee, firstname: BEE.firstname, lastname: BEE.lastname,  numberphone: BEE.numberphone}
        }))
    
        res.json(cartWithUser)

*/

}


const createNewCart = async(req, res) => {

    const { Buyer, prodact } = req.body

    if (!Buyer, !prodact ) {
        res.status(400).json({ message: 'all feilds are required'})
    
    }

    const tec = await User.findById(Buyer).lean()


  


    const sec = await Prodact.findById(prodact).lean()

    

    if (!tec || !sec )
    {
        return res.status(400).json({ message : "not user and prodact find"})
    }

    else {

        
            const cart = await Cart.create({  Buyer, prodact })
        
            if (cart) {
                return res.status(201).json({ message: 'new Cart created'})
            } else {
                return res.status(400).json({ message: 'invalid Cart data received'})
            }
    }

}


const deleteProdact = async(req, res) => {
    const { Buyer } = req.body

    if (!Buyer) {
        return res.status(400).json({message: ' Prodact id requird'})

    }

    const prodact = await Cart.findOne({Buyer: Buyer}).exec()

    if (!prodact) {
        return res.status(400).json({message: ' Prodact not found'})
    }

    const resoult = await prodact.deleteOne()
    const replay = `Prodact  with id ${resoult.Buyer} deleted`
    res.json(replay)
}





module.exports = {
    deleteProdact,
    createNewCart,
    getAllCartByer,
    getAllCartUser


}