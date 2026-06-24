/**
 * Genera el hash bcrypt de una contraseña para usar en .env
 *
 * Uso:
 *   node scripts/generateHash.js admin
 *
 * Resultado: copiar el hash en ADMIN_PASSWORD_HASH en .env
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcrypt');

const password = process.argv[2];
if (!password) {
  console.error('\n❌ Debes ingresar una contraseña como argumento.');
  console.error('   Ejemplo: node scripts/generateHash.js admin\n');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('\n✅ Hash generado. Agregar en backend/.env:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log('\n──────────────────────────────────────────────────────\n');
});
