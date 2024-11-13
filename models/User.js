const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema( // в схемі ми описуємо що обʼєкт і чи параметри обовʼязкові, їх тип і тд.
  {
    username: { type: String, require: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // додасть дати коли створені дані (createdAt ...)
);

module.exports = mongoose.model("User", UserSchema); //  так експортується схема
