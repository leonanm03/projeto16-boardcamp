// dependencies
import joi from "joi";

const customerSchema = joi.object({
  name: joi.string().min(1).required(),
  cpf: joi
    .string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  phone: joi.string().length(10).length(11).required(),
  birthday: joi.date().max("now").required(),
});

export default customerSchema;
