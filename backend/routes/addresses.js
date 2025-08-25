const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Address service handlers
const AddressService = {
  // Get all addresses for a user
  async getAddresses(req, res) {
    try {
      const { userId } = req.user; // From JWT middleware

      // In production, fetch from database
      // const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
      
      // Mock data for development
      const addresses = [
        {
          id: '1',
          name: 'Diatmiko Darajad',
          phone: '(+62) 878 8505 0919',
          address: 'Gg. Menur II, Kadisoko, Purwomartani, Kec. Kalasan (Rumah abu-abu no 28)',
          city: 'KALASAN',
          province: 'DI YOGYAKARTA',
          postalCode: '55571',
          label: 'Utama',
          isDefault: true,
          userId: userId,
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        },
        {
          id: '2',
          name: 'Diatmiko Darajad',
          phone: '(+62) 878 8505 0919',
          address: 'GRIYA Semeru Barat, Tegalsarjo, Kec. Jebres (Pondok Rajawali)',
          city: 'JEBRES, KOTA SURAKARTA (SOLO)',
          province: 'JAWA TENGAH',
          postalCode: '57122',
          label: 'Alamat Toko',
          isDefault: false,
          userId: userId,
          createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
        },
        {
          id: '3',
          name: 'Naufal Rayhan',
          phone: '(+62) 878 8505 0919',
          address: 'Jl. Kartika No.47, Jebres, Kota Surakarta, Jawa Tengah 57126 (Griya Hijau)',
          city: 'JEBRES, KOTA SURAKARTA (SOLO)',
          province: 'JAWA TENGAH',
          postalCode: '57121',
          label: 'Alamat pengembangan',
          isDefault: false,
          userId: userId,
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        },
      ];

      res.json({
        success: true,
        data: addresses
      });

    } catch (error) {
      console.error('Get Addresses Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get addresses' 
      });
    }
  },

  // Create new address
  async createAddress(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.user;
      const { name, phone, address, city, province, postalCode, label, isDefault } = req.body;

      // In production, handle default address logic
      // if (isDefault) {
      //   await Address.updateMany({ userId }, { isDefault: false });
      // }

      const newAddress = {
        id: `addr_${Date.now()}`,
        name,
        phone,
        address,
        city,
        province,
        postalCode,
        label,
        isDefault: isDefault || false,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In production, save to database
      // const savedAddress = await Address.create(newAddress);

      res.status(201).json({
        success: true,
        data: newAddress,
        message: 'Address created successfully'
      });

    } catch (error) {
      console.error('Create Address Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create address' 
      });
    }
  },

  // Update address
  async updateAddress(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.user;
      const { id } = req.params;
      const { name, phone, address, city, province, postalCode, label, isDefault } = req.body;

      // In production, check if address belongs to user
      // const existingAddress = await Address.findOne({ id, userId });
      // if (!existingAddress) {
      //   return res.status(404).json({ success: false, message: 'Address not found' });
      // }

      // In production, handle default address logic
      // if (isDefault) {
      //   await Address.updateMany({ userId }, { isDefault: false });
      // }

      const updatedAddress = {
        id,
        name,
        phone,
        address,
        city,
        province,
        postalCode,
        label,
        isDefault: isDefault || false,
        userId,
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), // Mock creation date
        updatedAt: new Date().toISOString(),
      };

      // In production, update in database
      // const savedAddress = await Address.findOneAndUpdate(
      //   { id, userId },
      //   updatedAddress,
      //   { new: true }
      // );

      res.json({
        success: true,
        data: updatedAddress,
        message: 'Address updated successfully'
      });

    } catch (error) {
      console.error('Update Address Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update address' 
      });
    }
  },

  // Delete address
  async deleteAddress(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;

      // In production, check if address belongs to user and is not default
      // const address = await Address.findOne({ id, userId });
      // if (!address) {
      //   return res.status(404).json({ success: false, message: 'Address not found' });
      // }
      // if (address.isDefault) {
      //   return res.status(400).json({ success: false, message: 'Cannot delete default address' });
      // }

      // In production, delete from database
      // await Address.findOneAndDelete({ id, userId });

      res.json({
        success: true,
        message: 'Address deleted successfully'
      });

    } catch (error) {
      console.error('Delete Address Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete address' 
      });
    }
  },

  // Set default address
  async setDefaultAddress(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;

      // In production, update default address
      // await Address.updateMany({ userId }, { isDefault: false });
      // const updatedAddress = await Address.findOneAndUpdate(
      //   { id, userId },
      //   { isDefault: true, updatedAt: new Date() },
      //   { new: true }
      // );

      // if (!updatedAddress) {
      //   return res.status(404).json({ success: false, message: 'Address not found' });
      // }

      res.json({
        success: true,
        message: 'Default address updated successfully'
      });

    } catch (error) {
      console.error('Set Default Address Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to set default address' 
      });
    }
  }
};

// JWT middleware for protected routes (reuse from auth.js)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Validation rules
const addressValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('province').notEmpty().withMessage('Province is required'),
  body('postalCode').isLength({ min: 5, max: 5 }).withMessage('Postal code must be 5 digits'),
  body('label').notEmpty().withMessage('Address label is required'),
];

// Routes
router.get('/', authenticateToken, AddressService.getAddresses);
router.post('/', authenticateToken, addressValidation, AddressService.createAddress);
router.put('/:id', authenticateToken, addressValidation, AddressService.updateAddress);
router.delete('/:id', authenticateToken, AddressService.deleteAddress);
router.put('/:id/set-default', authenticateToken, AddressService.setDefaultAddress);

module.exports = router;
