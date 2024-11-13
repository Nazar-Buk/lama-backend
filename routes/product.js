const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router(); // так підключати маршрутизатор (РУТЕР)

// CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, // першим параметром я пишу id, а другим те що я хочу обновити

      {
        $set: req.body, // оновить якщо я вкажу {new: true}, а я його нижче вказав =)
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET PRODUCTS

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL PRODUCTS

router.get("/", async (req, res) => {
  const qNew = req.query.new; // ось таку я лінку написав у постмені localhost:5001/api/products?new=true
  const qCategory = req.query.category; // ось таку я лінку написав у постмені localhost:5001/api/products?category=man
  // тому я можу отримати new, це просто назва

  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
      // Пояснення
      //       Product.find() використовується для пошуку всіх документів у колекції Product. Це асинхронна операція, тому ми використовуємо await, щоб дочекатися результату виконання.
      // .sort({ createdAt: -1 }):

      // sort() використовується для сортування результатів. У цьому випадку сортування відбувається за полем createdAt.
      // { createdAt: -1 } означає сортувати за полем createdAt у порядку спадання (від найновіших до найстаріших). Значення -1 означає спадання, а 1 — зростання.
      // .limit(1):

      // limit(1) обмежує кількість результатів, які повертає запит, до одного. У даному випадку повертається лише найновіший продукт (той, який має найновіше значення поля createdAt).
      //
      //
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory], // перевіряє чи qCategory є в масиві categories (це описано в models --> Product.js)
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router; // так можна експортувати роутер
