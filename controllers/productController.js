const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

//GET QUERY
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().lean();
  if (!products?.length) {
    return res.status(400).json({ message: "No products found." });
  }
  res.json(products);
});

//POST QUERY
const addNewProduct = asyncHandler(async (req, res) => {
  const { name, category, price } = req.body;

  //Confirm data
  if (!name || !category || !price || !Number.isInteger(price)) {
    return res.status(400).json({ message: "All field are required" });
  }

  //Check for duplicate
  const duplicate = await Product.findOne({ name }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Product" });
  }

  //Add New Product
  const productObject = { name, category, price };

  const product = await Product.create(productObject);

  if (product) {
    res.status(201).json({ message: `${name} is Added.` });
  } else {
    res.status(400).json({ message: "Invalid product data received" });
  }
});

//UPDATE QUERY
const updateProduct = asyncHandler(async (req, res) => {
  const { id, name, category, price } = req.body;

  //Confirm data
  if (!id || !name || !category || !price) {
    return res.status(400).json({ message: "All field are required." });
  }

  const product = await Product.findById(id).exec();

  if (!product) {
    return res.status(400).json({ message: "Product not found." });
  }
  //Check for duplicate
  const duplicate = await Product.findOne({ name }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Product" });
  }

  product.name = name;
  product.category = category;
  product.price = price;

  const updatedProduct = await product.save();

  res.json({ message: `${updatedProduct.name} updated` });
});
//DELETE QUERY
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Product Id required" });
  }

  const product = await Product.findById(id).exec();

  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }

  const result = await product.deleteOne();

  const reply = `Product ${result.name} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = {
  getAllProducts,
  addNewProduct,
  updateProduct,
  deleteProduct,
};
