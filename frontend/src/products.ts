// Lokasi file: src/products.ts

export interface ProductSize {
  size: string;
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  type: string;
  finish: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  inStock: boolean;
  images: string[];
  sizes: ProductSize[];
  description: string;
  specifications: Record<string, string>;
  features: string[];
  compatibleCars: string[];
  usage: string[];
  colorCode?: string;
}

// Helper function to get the primary image for a product
export const getPrimaryImage = (product: Product): string => {
  return product.images[0] || '';
};

// Helper function to check if a product is on sale
export const isProductOnSale = (product: Product): boolean => {
  return product.originalPrice !== undefined && product.originalPrice > product.price;
};

// Helper function to calculate discount percentage
export const getDiscountPercentage = (product: Product): number | null => {
  if (!isProductOnSale(product) || !product.originalPrice) return null;
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
};

export const products: Product[] = [
  {
    id: 1,
    name: 'PPG Deltron DG Performance Clear Coat',
    brand: 'PPG',
    type: 'Clear Coat',
    finish: 'Glossy',
    price: 850000,
    originalPrice: 950000,
    rating: 4.8,
    reviews: 124,
    badge: 'Best Seller',
    inStock: true,
    // PERBAIKAN: Menggunakan URL gambar yang valid
    images: [
      'https://www.nipponpaint-indonesia.com/data/products/WTB%20Ultimate%20PNG.png',
      'https://www.nipponpaint-indonesia.com/data/products/Elastex%20Waterproof%20Classic%20(1).png',
      'https://mobilecarpaint.com.au/wp-content/uploads/2021/04/d8135-1lt-300x300.jpg',
      'https://www.wyattmachine.com/uploads/1/2/4/2/124259754/s352134597395013580_p231_i1_w1280.jpeg'
    ],
    sizes: [
      { size: '500ml', price: 450000, stock: 15 },
      { size: '1L', price: 850000, originalPrice: 950000, stock: 8 },
      { size: '4L', price: 3200000, originalPrice: 3600000, stock: 3 }
    ],
    description: 'PPG Deltron DG Performance Clear Coat adalah lapisan pelindung premium yang memberikan kilap superior dan perlindungan jangka panjang. Diformulasikan khusus untuk aplikasi automotive professional dengan teknologi advanced UV protection.',
    specifications: { 'Jenis': 'Clear Coat 2K', 'Teknologi': 'Polyurethane', 'Kilap': 'High Gloss (>90)', 'Rasio Campuran': '2:1 (Clear:Hardener)', 'Aplikasi': 'Spray Gun 1.3-1.4mm' },
    features: ['Ketahanan UV superior hingga 10 tahun', 'Scratch resistance tinggi', 'Chemical resistance excellent', 'Easy polishing untuk maintenance'],
    compatibleCars: ['Toyota', 'Honda', 'Suzuki', 'Daihatsu', 'Mitsubishi', 'BMW', 'Mercedes', 'Audi'],
    usage: ['Pastikan permukaan bersih dan kering', 'Campurkan clear coat dengan hardener (2:1)', 'Aplikasikan 2-3 lapis tipis']
  },
  {
    id: 2,
    name: 'Sikkens Autocryl 2K Base Coat - Pearl White',
    brand: 'Sikkens',
    type: 'Base Coat',
    finish: 'Pearl',
    price: 650000,
    rating: 4.9,
    reviews: 89,
    badge: 'Premium',
    inStock: true,
    // PERBAIKAN: Menggunakan URL gambar yang valid
    images: [
      'https://www.carpaintonline.com/media/catalog/product/cache/2/image/600x/9df78eab33525d08d6e5fb8d27136e95/s/i/sikkens-autocryl-plus-basecoat_1.jpg',
      'https://www.nonpaints.com/media/catalog/product/cache/c1e5b90302e0ac154d65d18958beb758/s/i/sikkens_autocryl_plus_basecoat_lakstift_autolak.jpg',
      'https://shop.v-w-s.de/documents/image/12/121087/121087.jpg'
    ],
    sizes: [ { size: '500ml', price: 650000, stock: 20 }, { size: '1L', price: 1200000, stock: 12 } ],
    description: 'Cat dasar berkualitas tinggi dari Sikkens dengan warna Pearl White yang elegan. Memberikan cakupan yang sangat baik dan dasar yang sempurna untuk clear coat.',
    specifications: { 'Warna': 'Pearl White (Kode: PW123)', 'Teknologi': 'Acrylic Urethane', 'Rasio Campuran': '1:0.5 (Base:Thinner)', 'Aplikasi': 'Spray Gun 1.2-1.3mm' },
    features: ['Warna mutiara yang mendalam', 'Daya tutup luar biasa', 'Cepat kering'],
    compatibleCars: ['Toyota', 'Lexus', 'Honda'],
    usage: ['Gunakan thinner yang sesuai', 'Aplikasikan 2 lapis untuk cakupan optimal']
  },
  {
    id: 3,
    name: 'BASF R-M Agilis Primer Surfacer',
    brand: 'BASF',
    type: 'Primer',
    finish: 'Matte',
    price: 425000,
    originalPrice: 475000,
    rating: 4.7,
    reviews: 203,
    badge: 'Promo',
    inStock: true,
    // PERBAIKAN: Menggunakan URL gambar yang valid
    images: [
      'https://www.nonpaints.com/media/catalog/product/cache/c1e5b90302e0ac154d65d18958beb758/a/u/autolak_in_blik_2k-1.jpg',
      'https://www.nonpaints.com/media/catalog/product/cache/c1e5b90302e0ac154d65d18958beb758/r/m/rm-agilis-800-primer-surfacer-1-liter-donkergrijs_1.jpg',
      'https://www.nonpaints.com/media/catalog/product/cache/c1e5b90302e0ac154d65d18958beb758/r/m/rm-agilis-800-primer-surfacer-1-liter-donkergrijs.jpg'
    ],
    sizes: [{ size: '1L', price: 425000, originalPrice: 475000, stock: 30 }],
    description: 'Primer surfacer dari BASF yang mudah diamplas dan memiliki daya isi yang sangat baik, menciptakan permukaan yang sangat halus sebelum pengecatan.',
    specifications: { 'Jenis': 'Primer Surfacer 2K', 'Warna': 'Abu-abu', 'Pengamplasan': 'Basah (P800) atau Kering (P400)'},
    features: ['Daya rekat kuat pada metal dan plastik', 'Cepat kering dan mudah diamplas', 'Mengisi goresan halus dengan efektif'],
    compatibleCars: ['Universal'],
    usage: ['Pastikan permukaan bebas karat dan minyak', 'Aplikasikan 1-2 lapis']
  },
  {
    id: 4,
    name: 'Nippon Paint Thinner Standard Grade',
    brand: 'Nippon Paint',
    type: 'Thinner',
    finish: 'N/A',
    price: 125000,
    rating: 4.6,
    reviews: 156,
    badge: 'Popular',
    inStock: true,
    images: [
      'https://www.nipponpaint.com.sg/wp-content/uploads/2021/08/Thinner.png',
      'https://5.imimg.com/data5/SELLER/Default/2023/1/SD/DI/VT/12692257/nippon-paint-automotive-thinner-500x500.jpg'
    ],
    sizes: [
      { size: '1L', price: 125000, stock: 50 },
      { size: '4L', price: 450000, stock: 25 }
    ],
    description: 'Thinner berkualitas standar dari Nippon Paint, cocok untuk mengencerkan berbagai jenis cat dasar dan clear coat untuk mendapatkan viskositas yang tepat.',
    specifications: { 'Jenis': 'Thinner PU', 'Grade': 'Standard', 'Kompatibilitas': 'Cat berbasis solvent' },
    features: ['Penguapan medium', 'Tidak merusak lapisan cat', 'Meningkatkan flow dan leveling cat'],
    compatibleCars: ['Universal'],
    usage: ['Gunakan sesuai rasio yang direkomendasikan pada produk cat', 'Gunakan di area dengan ventilasi baik']
  },
  {
    id: 5,
    name: 'Sikkens Autocryl 2K Base - Midnight Black',
    brand: 'Sikkens',
    type: 'Base Coat',
    finish: 'Solid',
    price: 580000,
    rating: 4.8,
    reviews: 67,
    inStock: false,
    images: [
      'https://www.nonpaints.com/media/catalog/product/cache/c1e5b90302e0ac154d65d18958beb758/s/i/sikkens_autocryl_plus_basecoat_lakstift_autolak.jpg',
      'https://shop.v-w-s.de/documents/image/12/121087/121087.jpg'
    ],
    sizes: [ 
      { size: '500ml', price: 580000, stock: 0 } 
    ],
    description: 'Cat dasar warna Midnight Black dari Sikkens dengan hasil akhir solid yang elegan.',
    specifications: { 
      'Warna': 'Midnight Black', 
      'Teknologi': 'Acrylic Urethane', 
      'Rasio Campuran': '1:0.5 (Base:Thinner)'
    },
    features: [
      'Warna hitam pekat dan mendalam', 
      'Daya tutup excellent', 
      'Cocok untuk berbagai jenis mobil'
    ],
    compatibleCars: ['Honda', 'Toyota', 'Nissan'],
    usage: [
      'Gunakan thinner yang sesuai', 
      'Aplikasikan 2-3 lapis untuk hasil optimal'
    ],
    colorCode: 'NH731P'
  },
  {
    id: 6,
    name: 'PPG Envirobase High Performance - Metallic Silver',
    brand: 'PPG',
    type: 'Base Coat',
    finish: 'Metallic',
    price: 720000,
    rating: 4.9,
    reviews: 45,
    badge: 'New',
    inStock: true,
    images: [
      'https://mobilecarpaint.com.au/wp-content/uploads/2021/04/d8135-1lt-300x300.jpg',
      'https://www.wyattmachine.com/uploads/1/2/4/2/124259754/s352134597395013580_p231_i1_w1280.jpeg'
    ],
    sizes: [ 
      { size: '1L', price: 720000, stock: 5 } 
    ],
    description: 'Cat dasar metallic silver berkualitas tinggi dari PPG dengan efek kilau metalik yang menawan.',
    specifications: { 
      'Warna': 'Metallic Silver', 
      'Teknologi': 'Waterborne', 
      'Efek': 'Metallic Medium'
    },
    features: [
      'Ramah lingkungan (waterborne)', 
      'Efek metallic yang konsisten', 
      'Cepat kering'
    ],
    compatibleCars: ['BMW', 'Mercedes', 'Audi'],
    usage: [
      'Gunakan sesuai petunjuk aplikasi waterborne', 
      'Aplikasikan dengan spray gun khusus'
    ],
    colorCode: 'A83'
  }
];
