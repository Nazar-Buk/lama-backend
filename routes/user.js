const router = require("express").Router(); // так підключати маршрутизатор (РУТЕР)
const CryptoJS = require("crypto-js");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const User = require("../models/User");

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        // першим параметром я пишу id, а другим те що я хочу обновити
        $set: req.body, // оновить якщо я вкажу {new: true}, а я його нижче вказав =)
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;

    return res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL USERS

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new; // ось таку я лінку написав у постмені localhost:5001/api/users?new=true
  // тому я можу отримати new, це просто назва
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();

    return res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USERS STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      // це відноситься до монго, якісь методи чи що це таке =)
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router; // так можна експортувати роутер
