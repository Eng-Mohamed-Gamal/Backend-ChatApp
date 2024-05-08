import Joi from "joi";

export const signUpSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    userName: Joi.string().min(3).max(15).required(),
    password : Joi.string().min(7).max(25).required(),
  }).with("email" , "password").unknown(true),
};
export const logInSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password : Joi.string().min(7).max(25).required(),
  }).with("email" , "password"),
};
export const updateUserSchema = {
  body: Joi.object({
    userName: Joi.string().min(3).max(15),
    email: Joi.string().email(),
    oldPassword : Joi.string().min(7).max(25),
    newPassword : Joi.string().min(7).max(25),
  }).with("oldPassword" , "newPassword"),
};
export const getUsersSchema = {
  query: Joi.object({
    search : Joi.string().min(1).max(15).required()
  }),
};
