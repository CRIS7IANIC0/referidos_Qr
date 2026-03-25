const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = "admin@peluqueria.com";
  const password = "admin1";
  const name = "Administrador Principal";

  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  });

  if (existingAdmin) {
    console.log("El administrador ya existe.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  console.log(`¡Administrador creado con éxito!`);
  console.log(`Correo: ${email}`);
  console.log(`Contraseña: ${password}`);
  console.log(`Por favor inicia sesión y cambia tu contraseña cuando sea posible.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
