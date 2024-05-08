import Joi from "joi";
import { generalValidationRule } from "../../utils/general.validation.rule.js";


export const addOrFetchChatSchema = {
    query : Joi.object({
        userId : generalValidationRule.dbId.required()
    })
}