const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createUser: async (name, email, password) => {
      try {
        const existUser = await prisma.user.findUnique({ where: { email } });
        if (existUser) throw 'Email is already in use';
  
        const user = await prisma.user.create({ data: { name, email, password } });
        return user;
      } catch (err) {
        throw err;
      }
    },
  
    getAllUsers: async (limit, page) => {
      try {
        limit = Number(limit);
        page = Number(page);
        const users = await prisma.user.findMany({
          skip: (page - 1) * limit,
          take: limit,
          include: {
            profile: true,
            BankAccount: true,
          },
          orderBy: {
            id: 'asc',
          },
        });
  
        return users;
      } catch (err) {
        throw err;
      }
    },

     getUserById: async (userId) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!user) throw 'User tidak ditemukan';
  
        return user;
      } catch (err) {
        throw err;
      }
    },
  
  };
  