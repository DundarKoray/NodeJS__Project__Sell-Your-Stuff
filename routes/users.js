const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const {v4: uuidv4} = require('uuid')
const models = require('../models')

router.get('/add-product',(req,res) => {
  res.render('users/add-product', {className: 'product-preview-image-invisible'})
})

router.post('/add-product', async (req, res) => {
    let title = req.body.title
    let description = req.body.description
    let price = parseFloat(req.body.price)
    let userId = req.session.user.userId

    let product = models.Product.build({
        title: title,
        description: description,
        price: price,
        userId: userId
    })

    let persistedProduct = await product.save();
    if(persistedProduct != null) {
        res.redirect('/user/products')
    } else {
        res.render('users/add-product', {message: 'Unable to add the product'})
    }
})

function uploadFile(req,callback) {

  new formidable.IncomingForm().parse(req)
  .on('fileBegin',(name,file) => {
      uniqueFilename = `${uuidv4()}.${file.name.split('.').pop()}`
      file.name = uniqueFilename
      file.path = __basedir + '/uploads/' + file.name
  })
  .on('file',(name,file) => {
    callback(file.name)
  })

}

router.post('/upload',(req,res) => {

  uploadFile(req,(photoURL) => {
    photoURL = `/uploads/${photoURL}`
    res.render('users/add-product', {imageURL: photoURL, className: 'product-preview-image'})
  })

})


module.exports = router
