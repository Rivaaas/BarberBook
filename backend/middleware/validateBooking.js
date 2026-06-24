const { body, validationResult } = require('express-validator');

const validateBooking = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('phone').trim().notEmpty().withMessage('El teléfono es obligatorio'),
  body('email').trim().isEmail().withMessage('Ingresa un correo válido').normalizeEmail(),
  body('service').notEmpty().withMessage('El servicio es obligatorio'),
  body('barber').notEmpty().withMessage('El barbero es obligatorio'),
  body('date').notEmpty().withMessage('La fecha es obligatoria'),
  body('time').notEmpty().withMessage('La hora es obligatoria'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg).join(', '),
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = { validateBooking };
