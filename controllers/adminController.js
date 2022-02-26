const Product = require('../models/product');
const User = require('../models/user');


const add_product = async (request, response) => {
  // console.log(request.file);
  let imageArr = [];
  let categoriesArr = request.body.categories.split(',');
  for(let i = 0; i < request.files.length; i++) {
    imageArr.push(request.files[i].filename);
  }
  for (let i = 0; i < categoriesArr.length; i++){
    categoriesArr[i] = categoriesArr[i].trim().toLowerCase();
  }
  let product = new Product({
    title: request.body.title,
    price: request.body.price,
    quantity: request.body.quantity,
    desc: request.body.desc,
    image: imageArr,
    categories: categoriesArr
  });

  try {
    await product.save();
    response.redirect(`/products`);
  } catch (error) {
    console.log(error);
    response.redirect(`/products`);
  }
}


const admin = async (request, response) => {
  try {
    const users = await User.find({});
    response.render('users/admin', { users });
  }
  catch (error) {
    console.log(error);
  }
  }


const admin_toggle = async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    if (user.username !== 'admin') {
      await User.findByIdAndUpdate(request.params.id, { admin: !user.admin });
    }
    response.redirect('/admin');
  }
  catch (error) {
    console.log(error);
  }
  }


module.exports = { add_product, admin, admin_toggle }