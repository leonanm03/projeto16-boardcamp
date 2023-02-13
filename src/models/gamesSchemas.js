// dependencies
import joi from "joi";

const gameSchema = joi.object({
  name: joi.string().min(1).required(),
  image: joi.string().min(1).uri().required(),
  stockTotal: joi.number().greater(0).required(),
  pricePerDay: joi.number().greater(0).required(),
});

export default gameSchema;
