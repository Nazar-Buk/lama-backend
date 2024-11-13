const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER

router.post("/register", async (req, res) => {
  const newUser = User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      // зашифрував пароль щоб його не було видно в БД
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save(); //Збережe в базу даних
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    // !user && res.status(401).json("Wrong credentials!");
    if (!user) {
      return res.status(401).json("Wrong credentials!");
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    ); // розшифрував пароль

    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    // OriginalPassword !== req.body.password &&
    //   res.status(401).json({ message: "Wrong credentials!" });

    // res.status(200).json(user);

    if (OriginalPassword !== req.body.password) {
      return res.status(401).json("Wrong credentials!");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" } // щоб вилогінило через 3 дні
    );

    const { password, ...others } = user._doc; // others --> тут буде все що в user окрім password
    //(але прийшло ціла купа гімна і password теж та інші ключі), це тому що я не використовував _doc
    // _doc --> тут монго зберігає ту інфу котра нам потрібна

    return res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
