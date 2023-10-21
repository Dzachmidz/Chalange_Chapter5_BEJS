const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: async (name, email, password, profile) => {
    try {
      let encryptedPassword = await bcrypt.hash(password, 10);
      let user = await prisma.user.create({
        data: {
          name,
          email,
          password: encryptedPassword,
          profile: {
            create: profile,
          },
        },
      });

      return user;
    } catch (err) {
      throw err;
    }
  },

  login: async (email, password) => {
    try {
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw 'invalid email or password';
      }

      let isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw 'invalid email or password';
      }

      let token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

      return { user, token };
    } catch (err) {
      throw err;
    }
  },

  whoami: (user) => {
    return { user };
  },
};
