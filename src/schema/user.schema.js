import Joi from "joi";
// Joi is a powerful schema description language and data validator for JavaScript.
// It allows you to define schemas for your data, perform validation, and ensure
// your data meets the defined criteria before processing it.
export const userCreateSchema = Joi.object({
  gender:Joi.string().required().min(1),
  firstname:Joi.string().required().min(1),
  email:Joi.string().email({
    minDomainSegments: 2, tlds: { allow: ['com', 'net'] }
  }).required(),
  password:Joi.string().alphanum().regex(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/
  ).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  description:Joi.string().min(1),
  age:Joi.number().integer().required().min(59),
  height:Joi.number().integer().required().min(1),
  smoker:Joi.boolean(),
  marital:Joi.string().required().min(1),
  pet:Joi.boolean().required(),
  city:Joi.string().required().min(1),
  music:Joi.string().min(1),
  picture:Joi.string().min(1),
  zodiac:Joi.string().min(1),
  gender_match:Joi.string().required().min(1)
}).required();

// Validation schema for updating user information
export const userUpdateSchema = Joi.object({
  firstname: Joi.string(),
  email: Joi.string().email({
    minDomainSegments: 2, tlds: { allow: ['com', 'net'] }
  }),
  description: Joi.string(),
  smoker: Joi.boolean(),
  pet: Joi.boolean(),
  city: Joi.string(),
  music: Joi.string(),
  picture: Joi.string(),
  labels: Joi.array().items(Joi.number().integer())
}).required().min(1);