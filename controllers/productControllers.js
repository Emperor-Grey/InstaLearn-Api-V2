const Product = require('../models/products');

module.exports = {
  createProduct: async (req, res) => {
    try {
      const { title, supplier, description, category, price } = req.body;
      let imageUrl, fileUrl;

      // Upload image to Cloudinary
      if (req.files.image) {
        const imageUploadResult = await cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'products/images',
          },
          (error, result) => {
            if (error) {
              throw new Error('Image upload failed');
            }
            imageUrl = result.secure_url;
          }
        );
        req.files.image[0].stream.pipe(imageUploadResult);
      }

      // Upload file to Cloudinary
      if (req.files.file) {
        const fileUploadResult = await cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: 'products/files',
          },
          (error, result) => {
            if (error) {
              throw new Error('File upload failed');
            }
            fileUrl = result.secure_url;
          }
        );
        req.files.file[0].stream.pipe(fileUploadResult);
      }

      // Wait for both uploads to finish
      await Promise.all([imageUrl, fileUrl]);

      // Create the product
      const product = new Product({
        title,
        supplier,
        imageUrl,
        description,
        category,
        file: fileUrl,
        price,
      });

      await product.save();
      res
        .status(200)
        .json({ message: 'Product Created Successfully', product });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Failed to create a Product', error: err.message });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(200).json(products);
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Failed to get Products', error: err.message });
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Failed to get the Product', error: err.message });
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
      res.status(200).json(result);
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Failed to search Products', error: err.message });
    }
  },
};
