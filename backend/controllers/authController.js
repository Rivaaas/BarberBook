const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos.' });
    }

    const validUsername = username === process.env.ADMIN_USERNAME;
    if (!validUsername) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    }

    const validPassword = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ success: true, token, username });
  } catch (error) {
    next(error);
  }
};

const verifyToken = (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { login, verifyToken };
