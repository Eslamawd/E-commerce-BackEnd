const verifyRols = (...allwedRoles) =>
{
    return (req, res, next) => 
    {
        if(!req?.roles) return res.status(401)
        const rolesAray = [...allwedRoles]

        const resoult = req.roles.map(role => rolesAray.includes(role)).find(val => val === true)

        if(!resoult) return res.status(401)
        next();
    }
}
module.exports = verifyRols