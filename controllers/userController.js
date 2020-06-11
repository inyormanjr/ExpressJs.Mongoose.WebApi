const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/user');

//@desc     Get All Users
//@route    GET /api/v1/Users
//@access   public
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc     Get Single User
//@route    GET /api/v1/Users/:id
//@access   private
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse(`User not found with Id ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: user
    })
 
});

//@desc     Create User
//@route    POST /api/v1/Users/
//@access   private
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
});

//@desc     Update User
//@route    PUT /api/v1/Users/
//@access   private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: user }); 
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(
        new ErrorResponse(`User not found with Id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: {} });
});

exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
     return next(
       new ErrorResponse(`User not found with Id ${req.params.id}`, 404)
     );
  }

  if (!req.files) {
     return next(
       new ErrorResponse(`Please upload a file.`, 400)
     );
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
     return next(new ErrorResponse(`Please upload an image.`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Max imag size is  ${process.env.MAX_FILE_UPLOAD}.`,
        400
      )
    );
  }

  file.name = `photo_${user._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(
        new ErrorResponse(
          `Problem with the file`,
          500
        )
      );
    }
  });

  await User.findByIdAndUpdate(req.params.id, { photoUrl: file.name });
  
  res.status(200).json({
    success: true,
    data: file.name
  });
  
});

