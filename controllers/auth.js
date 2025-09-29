const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const sanitize = require("mongo-sanitize");
const sanitizeHtml = require("sanitize-html");

// Helper: puhdistaa syötteet XSS-hyökkäyksiä varten
const cleanInput = (input) => {
  if (typeof input !== "string") return "";
  return sanitizeHtml(sanitize(input.trim()));
};

// -------------------- Register --------------------
exports.register = asyncHandler(async (req, res, next) => {
  const name = cleanInput(req.body.name);
  const email = cleanInput(req.body.email);
  const password = cleanInput(req.body.password);
  const role = cleanInput(req.body.role);

  if (!email || !password) {
    return next(new ErrorResponse("Email & password required", 400));
  }

  const user = await User.create({ name, email, password, role });
  sendTokenResponse(user, 200, res);
});

// -------------------- Login --------------------
exports.login = asyncHandler(async (req, res, next) => {
  const email = cleanInput(req.body.email);
  const password = cleanInput(req.body.password);

  if (!email || !password) {
    return next(new ErrorResponse("Email & password required", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorResponse("Invalid credentials", 401));

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new ErrorResponse("Invalid credentials", 401));

  sendTokenResponse(user, 200, res);
});

// -------------------- Logout --------------------
exports.logOut = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});

// -------------------- Get Current User --------------------
exports.getMe = asyncHandler(async (req, res, next) => {
  if (!req.user) return next(new ErrorResponse("Not authorized", 401));

  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorResponse("User not found", 404));

  res.status(200).json({ success: true, data: user });
});

// -------------------- Update User Details --------------------
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {};
  if (req.body.name) fieldsToUpdate.name = cleanInput(req.body.name);
  if (req.body.email) fieldsToUpdate.email = cleanInput(req.body.email);

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

// -------------------- Update Password --------------------
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.matchPassword(cleanInput(req.body.currentPassword)))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = cleanInput(req.body.newPassword);
  await user.save();

  sendTokenResponse(user, 200, res);
});

// -------------------- Forgot Password --------------------
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const email = cleanInput(req.body.email);
  if (!email) return next(new ErrorResponse("Email required", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorResponse("No user with that email", 404));

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. PUT request to: ${resetUrl}`;

  try {
    await sendEmail({ email: user.email, subject: "Password reset", message });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// -------------------- Reset Password --------------------
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const password = cleanInput(req.body.password);

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorResponse("Invalid token", 400));

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// -------------------- Helper: sendTokenResponse --------------------
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") options.secure = true;

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
