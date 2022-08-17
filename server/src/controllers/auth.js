const { user, profile } = require('../../models')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {

    // our validation schema here
    const schema = Joi.object({
        fullname: Joi.string().min(4).required(),
        email: Joi.string().email().min(4).required(),
        password: Joi.string().min(4).required(),
    });

    const { error } = schema.validate(req.body);

    // if error exist send validation error message
    if (error)
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });

    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        const userCheck = await user.findOne({
            where: {
                email: req.body.email
            }
        })

        if (userCheck) {
            return res.status(400).send({
                status: 'failed',
                message: 'Email already Used'
            })
        }

        const newUser = await user.create({
            fullname: req.body.fullname,
            email: req.body.email,
            password: hashPassword,
            status: "user"
        })

        await profile.create({
            idUser: newUser.id,
            fullname: newUser.fullname,
            email: newUser.email
        })

        const token = jwt.sign({ id: newUser.id }, process.env.TOKEN_KEY)

        let users = {
            fullname: newUser.fullname,
            email: newUser.email,
            token
        }

        res.status(200).send({
            status: "success",
            data: {
                users
            }
        })

    } catch (error) {
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
}

exports.login = async (req, res) => {

    // our validation schema here
    const schema = Joi.object({
        email: Joi.string().email().min(4).required(),
        password: Joi.string().min(4).required(),
    });

    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body);

    // if error exist send validation error message
    if (error)
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });

    try {

        const userCheck = await user.findOne({
            where: {
                email: req.body.email
            }
        })

        // compare password between entered from client and from database
        const isValid = await bcrypt.compare(req.body.password, userCheck.password);

        // check if not valid then return response with status 400 (bad request)
        if (!isValid) {
            return res.status(400).send({
                status: "failed",
                message: "Wrong Password",
            });
        }

        // generate token
        const token = jwt.sign({ id: userCheck.id }, process.env.TOKEN_KEY);

        let users = {
            fullname: userCheck.fullname,
            email: userCheck.email,
            status: userCheck.status,
            token
        }

        res.status(200).send({
            status:"success",
            data:{users}
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }

}

exports.getUsers = async (req, res) => {
    try {
        const users = await user.findAll({
            include: {
                model: profile,
                as: "profile",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "idUser"],
                },
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt", "status"],
            },
        });

        res.status(200).send({
            status:"success",
            data:{users}
        })
    } catch (error) {
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
}

exports.checkAuth = async (req, res) => {
    try {
        const id = req.user.id;

        const dataUser = await user.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });

        if (!dataUser) {
            return res.status(404).send({
                status: "failed",
            });
        }

        res.send({
            status: "success",
            data: {
                user: {
                    id: dataUser.id,
                    fullname: dataUser.fullname,
                    email: dataUser.email,
                    status: dataUser.status,
                },
            },
        });
    } catch (error) {
        console.log(error);
        res.status({
            status: "failed",
            message: "Server Error",
        });
    }
};