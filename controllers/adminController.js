const Product = require('../models/product');


const add_product = async (request, response) => {
  console.log(request.file);
  let product = new Product({
    title: request.body.title,
    desc: request.body.desc,
    image: request.file.filename,
  });

  try {
    await product.save();
    response.redirect(`/`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { add_product }