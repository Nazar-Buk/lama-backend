const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  console.log(process.env.JWT_SEC, "process.env.JWT_SEC");

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // в headers у постмені я вставив слово Bearer "пробіл" токен, тому я розділяю за пропуском та вибираю 1-ий елемент масиву
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid !");

      req.user = user;
      next(); //продовжить виконання функції в user.js
    });
  } else {
    return res.status(401).json("You are not authenticated !");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  // ці дії може робити лише авторизований користувач

  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that !");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  // ці дії може робити лише адмін
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that !");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
