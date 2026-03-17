const bcrypt = require("bcrypt");
const { prisma } = require("./lib/prisma");

(async () => {
  try {
    const hash = await bcrypt.hash("Password123", 10);

    const user = await prisma.user.create({
      data: {
        email: "2021630814@alumno.ipn.mx",
        password: hash,
        role: "PLAYER",
        isActive: true,
      },
    });

    console.log("Usuario creado:");
    console.log(user);
  } catch (error) {
    console.error("Error al crear usuario:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();