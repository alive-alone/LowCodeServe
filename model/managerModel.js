module.exports = function (db, callback) {
  // 用户模型
  db.define("ManagerModel", {
    id: { type: 'serial', key: true },
    username: String,
    password: String,
    email: String,
    mobile: String,
    status: { type: Number, default: 1 },
    login_time: Number,
    add_time: Number,
  }, {
    table: "manager"
  });
  return callback();
}