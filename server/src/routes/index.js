const express = require('express')
const router = express.Router()

// CONTROLLERS
const { auth } = require('../middlewares/auth')
const {uploadFile} = require("../middlewares/uploadFile")

const { register, login, getUsers, checkAuth } = require('../controllers/auth')

const {getProfile} = require('../controllers/profile')

const {addFilm, getFilms, getFilm, getMyFilm} = require('../controllers/film')

const { addCategory, getCategorys, getCategory, updateCategory, deleteCategory } = require('../controllers/category')

const { addTransaction, getTransactions,getUserTransactions, updateStatus, deleteTransaction } = require('../controllers/transaction')

// ROUTE

router.get('/users', getUsers)
router.post('/register', register)
router.post('/login', login)
router.get("/check-auth",auth, checkAuth);

router.get("/profile", getProfile);

router.post('/add-film', auth, uploadFile("thumbnail"), addFilm)

router.get('/films', getFilms)
router.get('/film/:id', auth, getFilm)
router.get('/myFilm/:id', auth, getMyFilm)

router.post("/category", auth, addCategory)
router.get("/categorys", auth, getCategorys)
router.get("/category/:id", auth, getCategory)
router.patch("/category/:id", auth, updateCategory)
router.delete("/category/:id", auth, deleteCategory)

router.post('/add-transaction', auth, addTransaction)
router.get('/transactions', auth, getTransactions)
router.get('/my-transactions', auth, getUserTransactions)
router.patch('/update-status/:id', auth, updateStatus)
router.delete('/delete-transaction/:id', auth ,deleteTransaction)

module.exports = router