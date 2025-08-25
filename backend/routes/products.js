const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Product service handlers
const ProductService = {
  // Get all products with filtering and pagination
  async getProducts(req, res) {
    try {
      const { 
        page = 1, 
        limit = 12, 
        category, 
        brand, 
        search, 
        minPrice, 
        maxPrice, 
        sortBy = 'name',
        sortOrder = 'asc'
      } = req.query;

      // Simulate product data
      let products = [
        {
          id: 1,
          name: 'PPG Deltron DG Performance Clear Coat',
          brand: 'PPG',
          category: 'clear_coat',
          price: 850000,
          originalPrice: 950000,
          description: 'High-performance clear coat for automotive applications',
          image: '/api/placeholder/300/300',
          images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
          sizes: ['500ml', '1L', '4L'],
          inStock: true,
          stockQuantity: 25,
          rating: 4.8,
          reviewCount: 156,
          tags: ['premium', 'automotive', 'clear coat'],
          specifications: {
            type: 'Acrylic Urethane',
            coverage: '12-15 m²/L',
            dryTime: '30 minutes',
            recoatTime: '4-6 hours'
          }
        },
        {
          id: 2,
          name: 'Sikkens Autocryl 2K Base Coat - Pearl White',
          brand: 'Sikkens',
          category: 'base_coat',
          price: 650000,
          description: 'Premium pearl white base coat with excellent coverage',
          image: '/api/placeholder/300/300',
          images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
          sizes: ['500ml', '1L'],
          inStock: true,
          stockQuantity: 18,
          rating: 4.7,
          reviewCount: 89,
          tags: ['pearl', 'white', 'base coat'],
          specifications: {
            type: '2K Base Coat',
            coverage: '8-10 m²/L',
            dryTime: '20 minutes',
            recoatTime: '2-4 hours'
          }
        },
        {
          id: 3,
          name: 'BASF R-M Agilis Primer Surfacer',
          brand: 'BASF',
          category: 'primer',
          price: 425000,
          originalPrice: 475000,
          description: 'High-build primer surfacer for excellent adhesion',
          image: '/api/placeholder/300/300',
          images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
          sizes: ['1L', '4L'],
          inStock: true,
          stockQuantity: 32,
          rating: 4.6,
          reviewCount: 124,
          tags: ['primer', 'surfacer', 'high-build'],
          specifications: {
            type: 'Primer Surfacer',
            coverage: '6-8 m²/L',
            dryTime: '45 minutes',
            sandingTime: '2-3 hours'
          }
        },
        {
          id: 4,
          name: 'Spies Hecker Permahyd Hi-TEC Base Coat - Metallic Silver',
          brand: 'Spies Hecker',
          category: 'base_coat',
          price: 720000,
          description: 'Waterborne metallic silver base coat',
          image: '/api/placeholder/300/300',
          images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
          sizes: ['500ml', '1L'],
          inStock: false,
          stockQuantity: 0,
          rating: 4.9,
          reviewCount: 67,
          tags: ['metallic', 'silver', 'waterborne'],
          specifications: {
            type: 'Waterborne Base Coat',
            coverage: '8-10 m²/L',
            dryTime: '15 minutes',
            recoatTime: '1-2 hours'
          }
        }
      ];

      // Apply filters
      if (category) {
        products = products.filter(p => p.category === category);
      }
      if (brand) {
        products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
      }
      if (search) {
        const searchLower = search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
      if (minPrice) {
        products = products.filter(p => p.price >= parseInt(minPrice));
      }
      if (maxPrice) {
        products = products.filter(p => p.price <= parseInt(maxPrice));
      }

      // Apply sorting
      products.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedProducts = products.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          products: paginatedProducts,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: products.length,
            totalPages: Math.ceil(products.length / limit)
          },
          filters: {
            categories: ['clear_coat', 'base_coat', 'primer', 'thinner'],
            brands: ['PPG', 'Sikkens', 'BASF', 'Spies Hecker'],
            priceRange: {
              min: Math.min(...products.map(p => p.price)),
              max: Math.max(...products.map(p => p.price))
            }
          }
        }
      });

    } catch (error) {
      console.error('Get Products Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get products' 
      });
    }
  },

  // Get single product by ID
  async getProduct(req, res) {
    try {
      const { id } = req.params;

      // Simulate product data
      const product = {
        id: parseInt(id),
        name: 'PPG Deltron DG Performance Clear Coat',
        brand: 'PPG',
        category: 'clear_coat',
        price: 850000,
        originalPrice: 950000,
        description: 'High-performance clear coat for automotive applications with excellent durability and gloss retention.',
        longDescription: 'PPG Deltron DG Performance Clear Coat is a premium automotive clear coat designed for professional use. It provides exceptional gloss, durability, and weather resistance. Perfect for high-end automotive refinishing projects.',
        image: '/api/placeholder/600/600',
        images: [
          '/api/placeholder/600/600',
          '/api/placeholder/600/600',
          '/api/placeholder/600/600',
          '/api/placeholder/600/600'
        ],
        sizes: [
          { size: '500ml', price: 850000, inStock: true, stockQuantity: 15 },
          { size: '1L', price: 1500000, inStock: true, stockQuantity: 8 },
          { size: '4L', price: 5500000, inStock: false, stockQuantity: 0 }
        ],
        inStock: true,
        stockQuantity: 25,
        rating: 4.8,
        reviewCount: 156,
        tags: ['premium', 'automotive', 'clear coat', 'professional'],
        specifications: {
          type: 'Acrylic Urethane',
          coverage: '12-15 m²/L',
          dryTime: '30 minutes at 20°C',
          recoatTime: '4-6 hours',
          potLife: '8 hours at 20°C',
          mixingRatio: '2:1 with hardener',
          applicationMethod: 'Spray gun',
          temperature: '15-25°C',
          humidity: 'Max 80% RH'
        },
        features: [
          'Excellent gloss retention',
          'Superior weather resistance',
          'Easy application',
          'Fast drying',
          'Professional grade quality'
        ],
        relatedProducts: [2, 3, 4]
      };

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });

    } catch (error) {
      console.error('Get Product Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get product' 
      });
    }
  },

  // Get product categories
  async getCategories(req, res) {
    try {
      const categories = [
        {
          id: 'clear_coat',
          name: 'Clear Coat',
          description: 'Protective clear coatings',
          productCount: 45,
          image: '/api/placeholder/200/200'
        },
        {
          id: 'base_coat',
          name: 'Base Coat',
          description: 'Color base coats',
          productCount: 128,
          image: '/api/placeholder/200/200'
        },
        {
          id: 'primer',
          name: 'Primer',
          description: 'Primer and surfacers',
          productCount: 67,
          image: '/api/placeholder/200/200'
        },
        {
          id: 'thinner',
          name: 'Thinner & Reducer',
          description: 'Thinners and reducers',
          productCount: 34,
          image: '/api/placeholder/200/200'
        }
      ];

      res.json({
        success: true,
        data: categories
      });

    } catch (error) {
      console.error('Get Categories Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get categories' 
      });
    }
  },

  // Get product brands
  async getBrands(req, res) {
    try {
      const brands = [
        {
          id: 'ppg',
          name: 'PPG',
          description: 'Premium automotive paints',
          productCount: 89,
          logo: '/api/placeholder/100/50'
        },
        {
          id: 'sikkens',
          name: 'Sikkens',
          description: 'Professional coating solutions',
          productCount: 76,
          logo: '/api/placeholder/100/50'
        },
        {
          id: 'basf',
          name: 'BASF',
          description: 'Chemical solutions for automotive',
          productCount: 54,
          logo: '/api/placeholder/100/50'
        },
        {
          id: 'spies-hecker',
          name: 'Spies Hecker',
          description: 'Premium refinish systems',
          productCount: 43,
          logo: '/api/placeholder/100/50'
        }
      ];

      res.json({
        success: true,
        data: brands
      });

    } catch (error) {
      console.error('Get Brands Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get brands' 
      });
    }
  }
};

// Routes
router.get('/', ProductService.getProducts);
router.get('/categories', ProductService.getCategories);
router.get('/brands', ProductService.getBrands);
router.get('/:id', ProductService.getProduct);

module.exports = router;
