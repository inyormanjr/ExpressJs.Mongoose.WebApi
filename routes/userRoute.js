const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  userPhotoUpload
} = require('../controllers/userController');

const { protect } = require('../middlewares/auth');

const advanceResult = require('../middlewares/advancedResult');

const User = require('../models/user');

router.route('/').get(advanceResult(User), getUsers)
                 .post(protect, createUser);
router
  .route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);
router.route('/:id/photo').put(protect, userPhotoUpload);

module.exports = router;