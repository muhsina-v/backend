import Products from "../models/productsSchema.js";

// all the products
const allProducts = async (req, res) => {
  const product = await Products.find({ isDeleted: false });
  if (!product) {
    return res.status(204).json({ message: "no item in products" });
  }
  res.status(200).json({ data: product });
};

//  product by id
const getProductById = async (req, res) => {
  const singleProduct = await Products.findById(req.params.id);
  if (!singleProduct) {
    return res.status(401).json({ message: "product not found" });
  }
  res.json(singleProduct);
};

//  category
const getProductCategory = async (req, res) => {
  const productCategory = await Products.find({ type: req.params.type });
  if (!productCategory || productCategory.length === 0) {
    return res.status(404).json({ data: [], message: "category not found" });
  }
  res.json({ data: productCategory, message: "category found" });
};

export { allProducts, getProductById, getProductCategory };
