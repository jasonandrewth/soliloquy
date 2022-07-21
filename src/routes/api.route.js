const router = require('express').Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

router.get('/products', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true }
    })

    const categories = await prisma.category.findMany({
      include: { products: true }
    })

    res.json({ products, categories })
  } catch (error) {
    next(error)
  }
});

router.get('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await prisma.product.findUnique({
      include: { category: true },
      where: {
        id: Number(id)
      }
    })

    res.json(product)
  } catch (error) {
    next(error)
  }
});

router.get('/categories/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await prisma.category.findUnique({
      include: { products: true },
      where: {
        id: Number(id)
      }
    })

    res.json(product)
  } catch (error) {
    next(error)
  }
});

router.post('/products', async (req, res, next) => {
  try {
    const product = await prisma.product.create({
      data: {
        "name": "Okkk",
        "price": 20,
        "categoryId": 1
      }
    })
    res.json(product)
  } catch (error) {
    next(error)
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await prisma.product.delete({
      where: {
        id: Number(id)
      }
    })

    res.json(product.name)

  } catch (error) {
    next(error)
  }
});

router.patch('/products/:id', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

module.exports = router;
