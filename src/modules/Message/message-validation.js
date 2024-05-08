import Joi from "joi";
import { generalValidationRule } from "../../utils/general.validation.rule.js";


export const addMessageSchema = {
    body : Joi.object({
        chatId : generalValidationRule.dbId.required(),
        content : Joi.string().min(1).required()
    })
}
export const allMessagesSchema = {
    body : Joi.object({
        chatId : generalValidationRule.dbId.required(),
    })
}