import bcrypt, { compareSync, hashSync } from "bcrypt";
import Jwt from "jsonwebtoken";
import User from "../../../DB/Models/user.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generate-Unique-String.js";

export const signUp = async (req, res, next) => {
  const { email, userName, password } = req.body;

  // email Check
  const userCheck = await User.findOne({ email });
  if (userCheck) return next({ message: "Email Is Already Exist", cause: 400 });
  // password Hash
  const hasedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

  var folderId = generateUniqueString("123456789asdfgh", 6)  ; 
  if (req.file) {
    // generate unique string
    // uploade to cloudinary
    var { secure_url, public_id } =
      await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/${process.env.SEC_FOLDER}/${folderId}`,
      });
  }
  // create User
  const user = await User.create({
    userName,
    email,
    password: hasedPassword,
    profilePic: { secure_url, public_id },
    folderId,
  });
  if (!user) return next({ message: "Create Fail" });

  return res.status(201).json({ message: "Create Done", user });
};

export const logIn = async (req, res, next) => {
  const { email, password } = req.body;
  // email Check
  const user = await User.findOne({ email });
  if (!user) return next({ message: "Wrong Credentials", cause: 400 });
  // password check
  const comparePassword = bcrypt.compareSync(password, user.password);
  if (!comparePassword)return next({ message: "Wrong Credentials", cause: 400 });
  // generate token
  const token = Jwt.sign(
    { id: user._id, email },
    process.env.JWT_SECRET_LOGIN
  );
  // update loggin status in DB
  user.isLoggedIn = true;
  await user.save();

  return res.status(200).json({ message: "LogIn Done", token, user });
};

export const updateUser = async (req, res, next) => {
  const { userName, email, oldPassword, newPassword } = req.body;
  const { authUser: user } = req;
  if (email) {
    // email check
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist)
      return next({ message: "Email Is Already Exist", cause: 400 });
    // Update Email
    user.email = email;
  }
  // handle update password
  if (newPassword && !oldPassword)
    return next({ message: "Write The Old Password", cause: 400 });
  if (oldPassword && !newPassword)
    return next({ message: "Write The New Password", cause: 400 });
  if (newPassword && oldPassword) {
    // password Check
    const passwordCheck = compareSync(oldPassword, user.password);
    if (!passwordCheck)
      return next({ message: "OldPassword Not Correct", cause: 400 });
    const hasedPassword = hashSync(newPassword, +process.env.SALT_ROUNDS);
    user.password = hasedPassword;
  }
  // update UserName
  if (userName) user.userName = userName;
  
  await user.save();
  return res.status(200).json({ message: "Update Done", user });
};
export const uploadProfilePic = async (req, res, next) => {
  const { authUser: user } = req;
  const { oldPublicId } = req.body;
  if (!req.file) return next({ cause: 400, message: "Image is required" });
  // check if the user want to update the image
  if (oldPublicId) {
    const newPulicId = oldPublicId.split(`${user.folderId}/`)[1];
    const { secure_url } = await cloudinaryConnection().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.MAIN_FOLDER}/${process.env.SEC_FOLDER}/${user.folderId}`,
        public_id: newPulicId,
      }
    );
    // Update secure_url for Image
    user.profilePic.secure_url = secure_url;
    await user.save();
    return res.status(200).json({ message: "Upload Done", user });
  }

  // User Donot upload an image in signUp
  // generate unique string
  const folderId = generateUniqueString("123456789asdfgh", 6);
  // uploade to cloudinary
  const { secure_url, public_id } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `${process.env.MAIN_FOLDER}/${process.env.SEC_FOLDER}/${folderId}`,
    });
  // Updates
  user.profilePic = {
    secure_url,
    public_id,
  };
  user.folderId = folderId;
  await user.save();
  return res.status(200).json({ message: "Upload Done", user });
};

export const getAllUsers = async (req, res, next) => {
  const { _id: loggedId } = req.authUser;
  const { search } = req.query;
  // find Users except logged User with userName or Email
  const users = await User.find({
    $and: [
      { _id: { $ne: loggedId } },
      {
        $or: [
          { userName: { $regex: search, $options: "i"  } },
          { email: { $regex: search, $options: "i" } },
        ],
      },
    ],
  });

  return res
    .status(200)
    .json({ message: "Fetch Users Done", count: users.length, users });
};

export const deleteUser = async (req, res, next) => {
  const { _id: userId } = req.authUser;
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) return next({ message: "Delete Fail"});
  // delete from cloudinary
  await cloudinaryConnection().api.delete_resources_by_prefix(
    `${process.env.MAIN_FOLDER}/${process.env.SEC_FOLDER}/${deletedUser.folderId}`
  );
  await cloudinaryConnection().api.delete_folder(
    `${process.env.MAIN_FOLDER}/${process.env.SEC_FOLDER}/${deletedUser.folderId}`
  );
  return res.status(200).json({ message: "Delete Done", deletedUser });
};
