const Order = require("../models/Order");
const {
  verifyTokenAndAdmin,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("./verifyToken");
const router = require("express").Router(); // так підключати маршрутизатор (РУТЕР)

// CREATE

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    return res.status(200).json(savedOrder);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// UPDATE

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, // першим параметром я пишу id, а другим те що я хочу обновити

      {
        $set: req.body, // оновить якщо я вкажу {new: true}, а я його нижче вказав =)
      },
      { new: true }
    );

    return res.status(200).json(updatedOrder);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json("Order has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET USER ORDERS

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ id: req.params.id });

    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET ALL ORDERS

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET MONTHLY INCOME   Статистика

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    return res.status(200).json(income);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router; // так можна експортувати роутер
