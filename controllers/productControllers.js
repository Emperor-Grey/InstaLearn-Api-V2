const Product = require('../models/products');

module.exports = {
  createProduct: async (req, res) => {
    const product = await Product(req.body);
    try {
      await product.save();
      res.sendStatus(200).json('Product Created Successfully');
    } catch (err) {
      res.sendStatus(500).json(`Failed to create a Project ${err}`);
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.sendStatus(200).json(products);
    } catch (error) {
      res.sendStatus(500).json(`Failed to get the Project ${err}`);
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      res.sendStatus(200).json(product);
    } catch (error) {
      res.sendStatus(500).json(`Failed to get the Project ${err}`);
    }
  },

  searchProduct: async (req, res) => {
    try {
      const result = await Product.aggregate([
        {
          $search: {
            index: 'InstaLearn',
            text: {
              query: req.params.key,
              path: {
                wildcard: '*',
              },
            },
          },
        },
      ]);
      res.sendStatus(200).json(result);
    } catch (error) {
      res.sendStatus(500).json(`Failed to get Projects ${err}`);
    }
  },
};
