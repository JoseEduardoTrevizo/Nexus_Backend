const validateSchema = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: "Validación fallida",
      details: error.details.map((d) => d.message),
    });
  }
  next();
};

export default validateSchema;
