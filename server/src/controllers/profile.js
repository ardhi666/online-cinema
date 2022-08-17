const { profile } = require('../../models');

exports.getProfile = async (req, res) => {
    try {
        const idUser = req.user.id

        let data = await profile.findOne({
            where:{
                idUser
            }
        })

        res.status(200).send({
            status:"success",
            data
        })

    } catch (error) {
        res.status(400).send({
            status:"failed",
            message:"server error"
        })
    }
}