const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");
const verifyJWT = require("../middleware/verifyJWT");

productRouter.use(verifyJWT);

productRouter
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.addNewProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = productRouter;
