const { film, user, category, filmcategory, myFilm} = require('../../models')

exports.addFilm = async (req, res) => {

    try {

        let { categoryId } = req.body
        console.log(categoryId);
        let data = req.body
        let newProduct = await film.create({
            ...data,
            thumbnail: req.file.filename,
            idUser: req.user.id
        })

        if (categoryId) {
            categoryId = categoryId.split(',');
        }

        if (categoryId) {
            const filmCategoryData = categoryId.map((item) => {
                return { idFilm: newProduct.id, idCategory: parseInt(item) };
            });

            await filmcategory.bulkCreate(filmCategoryData);
        }


        let films = await film.findOne({
            where: {
                id: newProduct.id,
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "status"],
                    },
                },
                {
                    model: category,
                    as: 'categories',
                    through: {
                        model: filmcategory,
                        as: 'bridge',
                        attributes: [],
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        res.status(200).send({
            status: "success",
            data: { book: films }
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }

}

exports.getFilms = async (req, res) => {
    try {
        let films = await film.findAll({
            include: [
                {
                    model: category,
                    as: 'categories',
                    through: {
                        model: filmcategory,
                        as: 'bridge',
                        attributes: [],
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            ],
            attributes: {
                exclude: ['updatedAt', 'createdAt']
            }
        })

        films = JSON.parse(JSON.stringify(films))
        films = films.map((item) => {
            return {
                ...item,
                thumbnail: process.env.PATH_FILE + item.thumbnail
            }
        })

        res.status(200).send({
            status: "success",
            data: { book: films }
        })
    } catch (error) {
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getFilm = async (req, res) => {
    try {
        const { id } = req.params;
        let films = await film.findOne({
            where: { id },
            include: [
                {
                    model: category,
                    as: 'categories',
                    through: {
                        model: filmcategory,
                        as: 'bridge',
                        attributes: [],
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        films = JSON.parse(JSON.stringify(films));

        films = {
            ...films,
            thumbnail: process.env.PATH_FILE + films.thumbnail,
        }

        res.status(200).send({
            status: "success",
            data: { book: films }
        });
    } catch (error) {
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getMyFilm = async (req, res) => {
    try {
        const { id } = req.params;
        let films = await myFilm.findOne({
            where: {idUser: req.user.id , idFilm: id },
            include:{
                model:film,
                as:"film",
                include: [
                    {
                        model: category,
                        as: 'categories',
                        through: {
                            model: filmcategory,
                            as: 'bridge',
                            attributes: [],
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                ],
            }
        });

        res.status(200).send({
            status: "success",
            films
        });
    } catch (error) {
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }
}