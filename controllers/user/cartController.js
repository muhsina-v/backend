import Cart from "../../models/cartSchema.js";
import CustomError from "../../utils/customError.js";

const addToCart = async (req,res,next) => {
    const {productID,quantity}=req.body;
  const userID=req.user.id
  console.log(userID);
  
    // good input
    if (!productID || !quantity) {
      return next(new CustomError("Product ID and quantity are required.", 400));
    }
    if (quantity < 1) {
      return next(new CustomError("Quantity must be at least 1.", 400));
    }
  //users
    let cart = await Cart.findOne({ userID: req.user.id })
    if (!cart) {
      cart = new Cart({
        userID: req.user.id,
        products: [{ productID, quantity }],
      });
    } else {
      const existingProduct = cart.products.find(
        (prod) => prod.productID=== productID
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productID, quantity });
      }
    }
    await cart.save();
    res.status(200).json({ message: "Product added to cart successfully", cart });
  };
  


// to get the userCart
const getUserCart = async (req, res) => {
  const data = await Cart.findOne({ userID: req.user.id }).populate({
    path: "products.productID",
    // to specify which fields to populate  
    select: "name price image",
  });
  
  if (data) {
    res.status(200).json(data);
  } else {
    // if no cart,will return empty array
    res.status(200).json({ products: [] });
  }
};

const updateUserCart = async (req,res,next) => {
  const { productID,quantity} =req.body;
  
  if (!productID || !quantity) {
    return next(new CustomError("Product ID and quantity are required.",400));
  }
  if (quantity < 1) {
    //if quantity is lesser than 1 , error
    next(new CustomError(`Invalid quantity: ${quantity}`,400));
  }

  let cart = await Cart.findOne({userID:req.user.id});
  // if user does not have cart,will create one
  if (!cart) {
    cart = new Cart({
      userID: req.user.id,
      products: [{ productID, quantity }],
    });
  } else {
    // checking if the products already in the cart
    const productIndex=cart.products.findIndex(
      (prod) => prod.productID.toString()===productID
    );
    if (productIndex > -1) {
      // if the product already there update the quantity
      cart.products[productIndex].quantity=quantity;
    } else {
      // if the prod not exists, will push
      cart.products.push({ productID,quantity });
    }
  }

  await cart.save();
  res.status(200).json({message:"Product added to cart"});
};

const removeFromCart = async (req, res) => {
  //finding the cart of the user with user id and remove the product
  const cart = await Cart.findOneAndUpdate(
    { userID: req.user.id, "products.productID": req.body.productID },
    { $pull: { products: { productID: req.body.productID } } },
    { new: true }
  );
  if (cart) {
    res.status(200).json({message:"item removed",cart:cart.products || []});
  } else {
    res.status(404).json({ message: "Product not found in the cart"});
  }
};

export { addToCart,getUserCart,updateUserCart,removeFromCart };