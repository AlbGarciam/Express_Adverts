const mongoose = require('mongoose');
/**
 * User type definition
 * @typedef {Object} User
 * @property {string} name Name of the user
 * @property {string} password Password of the user
 * @property {string} username Username of the user
 * @property {cuid} cuid Unique identifier of the user
 * @property {Date} registration Registration date of the user
 */
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  username: {
    type: String, unique: true, required: true, dropDups: true, index: true,
  },
  cuid: {
    type: String, unique: true, required: true, dropDups: true, index: true,
  },
  salt: { type: String, unique: true, required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});


/**
 * This callback is displayed as part of the Requester class.
 * @callback User~searchCallback
 * @param {Error} error
 * @param {User} user
 */

/**
   * Search the user in the database by username
   *
   * @param {string} username - Username of the user
   * @param {User~searchCallback} callback - The callback that handles the response.
   */
userSchema.statics.search_by_username = (username, callback) => {
  const query = User.findOne({ username }).select('name password username cuid dateAdded salt -_id');
  query.exec(callback); // Esto es lo mismo que lo de arriba
};

/**
   * Updates the password of a user
   *
   * @param {string} id - Id of user to be updated
   * @param {string} newPassword - new password
   * @param {User~searchCallback} callback - The callback that handles the response.
   */
userSchema.statics.change_password = (id, newPassword, callback) => {
  const query = User.update({ cuid: id }, { password: newPassword });
  query.exec(callback);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
