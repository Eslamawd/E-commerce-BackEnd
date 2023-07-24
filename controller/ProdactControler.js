const User = require('../models/User')
const Prodact = require('../models/Prodact')
const multer = require('multer')




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename : (req, file, cb) => {

        const filename = `${Date.now()}_${file.originalname.replace(/\s+/g, '-')}`

        cb(null, filename)

    },
})


const upload = multer({
    storage: storage,
    limits: {fileSize: 5000000}

})



const lastManth = new Date()
lastManth.setMonth(lastManth.getMonth() - 3);






const getAllProudacts = async(req, res) => {

    const proudacts = await Prodact.find({ createdAt: { $gte: lastManth}}).lean()
   

    if (!proudacts?.length) {
        return res.status(400).json({ message:'no prodauct found'})
    }

    const ProdactWithUser = await Promise.all(proudacts.map(async(prodact) =>{
        const user = await User.findById(prodact.user).lean().exec()

        return { ...prodact, username: user.username, numberphone: user.numberphone}
    }))
    res.json(ProdactWithUser)

}

const getProudact = async(req, res) => {

    const { id } = req.params

    const prodact = await Prodact.findById(
       { _id: id },
        { $inc: { visit: 1 }},
        { upsert: true}
    ).exec()
    
    if (!prodact) {
        return res.status(400).json({message: 'Prodact not found'})
    }
  
        if (prodact)  {

      
        const medo  = async() =>  {
         const user = await User.findById(prodact.user).lean()

        return { ...prodact, username: user.username, numberphone: user.numberphone}}
        res.json(medo)
        }


    

}



const getProType = async(req, res) => {

    const { prodacttype } = req.body

    const proudacts = await Prodact.find(
        { prodacttype:  prodacttype  },
        { createdAt: { $gte: lastManth} },
       { visit: { $gte: 100} },).lean()

    if (!proudacts?.length) {
        return res.status(400).json({ message:'no prodauct found'})
    }

    const ProdactWithUser = await Promise.all(proudacts.map(async (prodact) =>{
        const user = await User.findById(prodact.user).lean().exec()

        return {...prodact, username: user.username, numberphone: user.numberphone}
    }))
    res.json(ProdactWithUser)
}



const createNewProdact =  async(req, res) => { 
    

    
       const { user, title, price, name, prodacttype } = req.body

   
  
       const image = req.file.filename


       if (user) {
        const ok = User.findById({ user })
        if (!ok) {

            return res.status(404).json({message: "can not dawnload"})
        }
       } 
       if(!image) {
           res.status(400).json({ message: 'not image uploaded'})
        } else {
           const newProdact = new Prodact({ 
                 user,
                 title,
                 image, 
                 price, 
                 name, 
                 prodacttype
                })
                
     
                newProdact.save((err, result) => {
     
                 if(err) {
                     
                     return res.status(400).json({ message: 'can not upload the image'})
                 } else if (result) {
     
                     console.log(result)
                     return res.status(200).json({message: 'save new '})
                 }
                })
                
            }


}
/*
        const imagePath = file
    
    

       try {
          if (!user || !title || !price || !name || !prodacttype) {
             res.status(400).json({ message: 'all feilds are required'})
              
            } else if (user || title || price || name || prodacttype) {

                const sell =  User.findOne({_id: user})

                if (sell) {
                    const ree = Prodact.findOne({title: title})

                    if (ree) {
                        fs.readFile(imagePath, (err, data) => {
                            if (err) throw err

                            const buffer = Buffer.from(data)
                            const imagee = new Image({data: buffer})
            
                            const newProdact = new Prodact({ 
                                  user,
                                  title,
                                  image: req.file.buffer , 
                                  price, 
                                  name, 
                                  prodacttype
                                 })
    
                         const ress = newProdact.save()
                          res.status(200).json(ress)
                        })
                    }
                    else{

                        res.status(404)
                    }
                }else {
                    res.status(401).json({message: "not fooooo"})
                }



             }
            
        } catch (err) {
            console.log(err)
            
       }



    
     
          /*  const { user, title,  price, name, prodacttype } = req.body
            const { image }  = req.file.filename
        
if (!user || !title || !image || !price || !name || !prodacttype) {
              res.status(400).json({ message: 'all feilds are required'})
            
           }
        
            const ruser = await User.findById(user).lean()
            const duplcate = await Prodact.findOne({ title: title }).lean().exec()
        
            console.log(ruser)
        
            if (duplcate) {
                return res.status(409).json({message: 'duplcate new Prodact'})
            }
        
            if (!ruser) {
        
                return res.status(409).json({message: 'not user'})
        
            }

            const prodact =  new Prodact({ user, title, image, price, name, prodacttype })
        
            prodact.save(function (err) {
                if (err) {
                    res.sendStatus(500)
                }
                else {
                    res.sendStatus(200)
                }
            })
          */
            
       // }
    
    



const updateProdact = async(req, res) => {

    const {id, user, title, image, price, name, prodacttype} = req.body

    if (!id, !user || !title || !image || !price || !name || !prodacttype) {
        return res.status(400).json({ message: 'all feilds are required'})
    }

    const prodact = await Prodact.findById(id).exec()
    
    if (!prodact) {
        return res.status(400).json({message: 'Prodact not found'})
    }

    const duplicate = await Prodact.findOne({ title }).lean().exec()

    if  (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'duplicate Prodact title'})
    }

    prodact.user = user 
    prodact.title = title 
    prodact.image = image 
    prodact.name = name 
    prodact.price = price 
    prodact.prodacttype = prodacttype 


    const updated = await prodact.save()

    res.json(`${updated.name} upteded`)

}


const deleteProdact = async(req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({message: ' Prodact id requird'})

    }

    const prodact = await Prodact.findById(id).exec()

    if (!prodact) {
        return res.status(400).json({message: ' Prodact not found'})
    }

    const resoult = await prodact.deleteOne()
    const replay = `Prodact '${resoult.title}' with id ${resoult.name} deleted`
    res.json(replay)
}

module.exports = {
    getAllProudacts,
    createNewProdact,
    updateProdact,
    deleteProdact,
    getProType,
    getProudact
}
