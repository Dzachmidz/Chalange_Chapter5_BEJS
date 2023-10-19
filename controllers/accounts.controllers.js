const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createAccount: async (req, res, next) => {
    try {
      let { userId, bankName, bankAccountNumber, balance } = req.body;
      const user = await prisma.user.findUnique({
        where: { id : Number(userId) },
      });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User tidak ditemukan",
          data: null,
        }); 
      }
      let account = await prisma.bankAccount.create({
        data: {
          userId: Number(userId),
          bankName,
          bankAccountNumber,
          balance,
        },
      });

      res.status(201).json({
        status: true,
        message: "Account Created Successfully!",
        data: account,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },

  getAllAccounts: async (req, res, next) => {
    try {
      let allAccount = await prisma.bankAccount.findMany({});
      res.status(200).json({
        status: true,
        message: "All Accounts Data",
        data: allAccount,
      });
    } catch (error) {
      next(err);
    }
  },

  getDetailAccount: async (req, res, next) => {
    try {
      let { accountId } = req.params;
      let detailAccount = await prisma.bankAccount.findUnique({
        where: {
            id: Number(accountId)},
      });

      if (!detailAccount) {
        return res.status(400).json({
          status: false,
          message: "User Not Found",
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: "Account Found",
        data: detailAccount,
      });
    } catch (err) {
      next(err);
    }
  },
  updateAccountBank: async (req, res, next) => {
    try {
      let { accountId } = req.params;
      let { bankName, bankAccountNumber, balance } = req.body;

      let updatedAccount = await prisma.bankAccount.update({
        where: { id: Number(accountId) },
        data: {
          bankName,
          bankAccountNumber,
          balance,
        },
      });

      res.status(200).json({
        status: true,
        message: "account di update succes",
        data: updatedAccount,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteAccount: async (req, res, next) => {
    try {
      let { accountId } = req.params;
      let deletedAccount = await prisma.bankAccount.delete({
        where: { id: Number(accountId) },
      });

      res.status(200).json({
        status: true,
        message: "delete successful",
        data: deletedAccount,
      });
    } catch (err) {
      next(err);
    }
  },
};
