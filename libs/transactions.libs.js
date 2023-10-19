const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  createTransaction: async (sourceAccountId, destinasiAccountId, amount) => {
    try {
      // Validasi akun pengirim
      let sourceAccount = await prisma.bankAccount.findUnique({
        where: {
          id: sourceAccountId,
        },
      });

      if (!sourceAccount) {
        throw 'Source account not found';
      }

      // Validasi akun penerima
      let destinasiAccount = await prisma.bankAccount.findUnique({
        where: {
          id: destinasiAccountId,
        },
      });

      if (!destinasiAccount) {
        throw 'Destinasi account not found';
      }

      // Validasi apakah saldo cukup
      if (sourceAccount.balance < amount) {
        throw 'Insufficient balance';
      }

      // Membuat transaksi
      let createTransaction = await prisma.transaksi.create({
        data: {
          sourceAccountId,
          destinasiAccountId,
          amount,
        },
      });

      // Mengurangi saldo pengirim
      await prisma.bankAccount.update({
        where: {
          id: sourceAccountId,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Menambahkan saldo penerima
      await prisma.bankAccount.update({
        where: {
          id: destinasiAccountId,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return createTransaction;
    } catch (err) {
      throw err;
    }
  },

  getAllTransaction: async () => {
    try {
      const transactions = await prisma.transaksi.findMany();
      return transactions;
    } catch (err) {
      throw err;
    }
  },

  getDetailTransaction: async (transactionId) => {
    try {
      const transaction = await prisma.transaksi.findUnique({
        where: { id: Number(transactionId) },
      });

      if (!transaction) {
        throw 'Transaction not found';
      }

      // Dapatkan detail akun pengirim
      let sourceAccount = await prisma.bankAccount.findUnique({
        where: { id: transaction.sourceAccountId },
      });

      // Dapatkan detail akun penerima
      let destinasiAccount = await prisma.bankAccount.findUnique({
        where: { id: transaction.destinasiAccountId },
      });

      // Menggabungkan data transaksi dengan detail akun
      let transactionDetails = {
        ...transaction,
        sourceAccount: sourceAccount,
        destinasiAccount: destinasiAccount,
      };

      return transactionDetails;
    } catch (err) {
      throw err;
    }
  },
};
