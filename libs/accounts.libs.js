const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  createAccount: async (userId, bankName, bankAccountNumber, balance) => {
    try {
      const account = await prisma.bankAccount.create({
        data: {
          userId: userId,
          bankName,
          bankAccountNumber,
          balance,
        },
      });

      return account;
    } catch (err) {
      throw err;
    }
  },

  getAllAccounts: async () => {
    try {
      const allAccounts = await prisma.bankAccount.findMany({});
      return allAccounts;
    } catch (err) {
      throw err;
    }
  },

  getDetailAccount: async (accountId) => {
    try {
      const detailAccount = await prisma.bankAccount.findUnique({
        where: {
          id: Number(accountId),
        },
      });

      if (!detailAccount) {
        throw 'Account not found';
      }

      return detailAccount;
    } catch (err) {
      throw err;
    }
  },
};
