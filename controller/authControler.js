const User = require('../models/User')
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken')

require('dotenv').config()



const login = async (req, res) => {
        
    const { username, password } = req.body



            if (!username || !password) { 
                return res.status(401).json({
                    messege: 'all filds are requird'
                })
            }

    const foundUser = await User.findOne({ username }).exec()

            if (!foundUser) {
                return res.status(401).json({
                    messege: 'Unauthorized'
                })
            }

    const match = await bcrypt.compare(password, foundUser.password)
  

            if (!match) return res.status(401).json({message: "Unauthorized"})

                const roles = Object.values(foundUser.roles)

                const accessToken = jwt.sign(
                
                        {"UserInfo": {
                            "id": foundUser._id,
                            "username": foundUser.username,
                            "roles": roles
                        }},
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '20s'}

                )
                
                const refreshToken = jwt.sign(
                    { "username": foundUser.username },
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

            
            
}










const refresh = (req, res) => {

        const cookies = req.cookies
        if (!cookies?.jwt) return res.status(401).json({ messege: 'unauthorized'});
        const refreshToken = cookies.jwt
        
        
         jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.status(403).json({ message: 'Forbidden' })
    
                const foundUser = await User.findOne({ username: decoded.username }).exec()
    
                if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })
    
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "id": foundUser._id,
                            "username": foundUser.username,
                            "roles": foundUser.roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '7d' }
                   ) 

                   res.json({ accessToken })
            })
            
}


/*

const refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundUser = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse!
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); //Forbidden
                // Delete refresh tokens of hacked user
                const hackedUser = await User.findOne({ username: decoded.username }).exec();
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
            }
        )
        return res.sendStatus(403); //Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                // expired refresh token
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
            }
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            // Refresh token was still valid
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );

            const newRefreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '15s' }
            );
            // Saving refreshToken with current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

            res.json({ accessToken })
        }
    );
}

*/


const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}