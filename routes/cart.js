const Cart = require("../models/Cart");
const {
  verifyTokenAndAdmin,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("./verifyToken");
const router = require("express").Router(); // так підключати маршрутизатор (РУТЕР)

// CREATE

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    return res.status(200).json(savedCart);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// UPDATE

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id, // першим параметром я пишу id, а другим те що я хочу обновити

      {
        $set: req.body, // оновить якщо я вкажу {new: true}, а я його нижче вказав =)
      },
      { new: true }
    );

    return res.status(200).json(updatedCart);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    return res.status(200).json("Cart has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET USER CART

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ id: req.params.id });

    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET ALL Отримати всі картки всіх користувачів, доступно тільки для адміна

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    return res.status(200).json(carts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router; // так можна експортувати роутер
