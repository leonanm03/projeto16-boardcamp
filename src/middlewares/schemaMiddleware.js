export default function validateSchema(schema) {
  return (req, res, next) => {
    const { err } = schema.validate(req.body, { abortEarly: false });
    if (err) {
      const errorMessages = err.details.map((e) => e.message);
      return res.status(400).send(errorMessages);
    }
    next();
  };
}
