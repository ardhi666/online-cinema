const { category } = require("../../models")


exports.addCategory = async (req, res) => {
    try {
        let data = req.body

        let newCategories = await category.create(data)
        
        let Category = await category.findOne({
            where:{
                id: newCategories.id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt","idUser"],
            }
        })

        res.status(200).send({
            status: "success",
            data: {
                Category
            }
        })
    } catch (error) {
        res.send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getCategorys = async (req, res) => {
    try {
        const categories = await category.findAll({
            
            attributes:{
                exclude:['updatedAt','createdAt']
            }
        }) 

        res.status(200).send({
            status:"success",
            categories
        })
    } catch (error) {
        
    }
}

exports.getCategory = async (req, res) => {
    try {
        const {id} = req.params
        const catagorys = await category.findOne({
            where:{
                id:id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            }
        })
        res.status(200).send({
            status:"success",
            data:{
                catagorys
            }
        })
    } catch (error) {
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const {id} = req.params
        const categorys = req.body

        await category.update(categorys,{
            where:{
                id
            }
        })

        res.status(200).send({
            status:"success",
            data:{
                categorys
            }
        })

    } catch (error) {
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const {id} = req.params
        await category.destroy({
            where:{
                id
            }
        })
        res.status(200).send({
            status:"succes",
            data:{
                id
            }
        })
    } catch (error) {
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }
}