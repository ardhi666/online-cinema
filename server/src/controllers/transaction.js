const { user, transaction, film, profile, category, filmcategory, myFilm } = require('../../models');
const midtransClient = require("midtrans-client");

exports.addTransaction = async (req, res) => {
    try {
        let data = req.body

        data = {
            id: parseInt(data.idFilm + Math.random().toString().slice(3, 8)),
            ...data,
            idBuyer: req.user.id,
            status: "Pending",
        };

        const newData = await transaction.create(data);

        const buyerData = await user.findOne({
            include: {
                model: profile,
                as: "profile",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "idUser"],
                },
            },
            where: {
                id: newData.idBuyer,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });

        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });

        let parameter = {
            transaction_details: {
                order_id: newData.id,
                gross_amount: newData.price,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
                full_name: buyerData?.fullname,
                email: buyerData?.email,
                phone: buyerData?.profile?.phone,
            },
        };

        const payment = await snap.createTransaction(parameter);

        res.status(200).send({
            status: "pending",
            message: "Pending transaction payment gateway",
            payment,
            film: {
                id: data.idFilm,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
}

exports.getTransactions = async (req, res) => {
    try {
        let transactions = await transaction.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idBuyer', 'idSeller']
            },
            include: [
                {
                    model: film,
                    as: 'film',
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
                        exclude: ['createdAt', 'updatedAt', 'idUser', 'qty', 'price']
                    }
                },
                {
                    model: user,
                    as: 'buyer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                },
                {
                    model: user,
                    as: 'seller',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                }
            ]
        })

        res.status(200).send({
            status: 'success',
            data: {
                transactions
            }
        })
    } catch (error) {
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getUserTransactions = async (req, res) => {
    try {
        let transactions = await transaction.findAll({
            where: {
                idBuyer: req.user.id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idBuyer', 'idSeller']
            },
            include: [
                {
                    model: film,
                    as: 'film',
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
                        exclude: ['createdAt', 'updatedAt', 'idUser', 'qty', 'price']
                    }
                },
                {
                    model: user,
                    as: 'buyer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                },
                {
                    model: user,
                    as: 'seller',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                }
            ]
        })

        res.status(200).send({
            status: 'success',
            data: {
                transactions
            }
        })
    } catch (error) {
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params
        const status = req.body

        await transaction.update(status, {
            where: {
                id: id,
            }, status: status
        })

        const data = await transaction.findOne({
            where:{
                id:id
            }
        })

        await myFilm.create({
            idUser: data.idBuyer,
            idFilm : data.idFilm
        })

        res.status(200).send({
            status: "success",
            message: "Update Success",
            data
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }
}

const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

const core = new midtransClient.CoreApi();

core.apiConfig.set({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY,
});

/**
 *  Handle update transaction status after notification
 * from midtrans webhook
 * @param {string} status
 * @param {transactionId} transactionId
 */


exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params
        await transaction.destroy({
            where: {
                id
            }
        })

        res.status(200).send({
            status: "success",
            data: {
                id
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }
}