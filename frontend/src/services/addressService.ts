export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  label: string;
  isDefault: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  label: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends CreateAddressRequest {
  id: string;
}

class AddressService {
  private baseUrl = 'http://localhost:3001/api';

  async getAddresses(): Promise<Address[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      // Return mock data for development
      return this.getMockAddresses();
    }
  }

  async createAddress(addressData: CreateAddressRequest): Promise<Address> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/addresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error('Failed to create address');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating address:', error);
      // Return mock data for development
      return this.createMockAddress(addressData);
    }
  }

  async updateAddress(addressData: UpdateAddressRequest): Promise<Address> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/addresses/${addressData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error('Failed to update address');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating address:', error);
      // Return mock data for development
      return this.createMockAddress(addressData);
    }
  }

  async deleteAddress(addressId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      return true; // Return true for development
    }
  }

  async setDefaultAddress(addressId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/addresses/${addressId}/set-default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      return true;
    } catch (error) {
      console.error('Error setting default address:', error);
      return true; // Return true for development
    }
  }

  // Mock data for development
  private getMockAddresses(): Address[] {
    return [
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
        userId: 'user_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
        userId: 'user_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
        userId: 'user_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private createMockAddress(addressData: CreateAddressRequest | UpdateAddressRequest): Address {
    return {
      id: 'id' in addressData ? addressData.id : `addr_${Date.now()}`,
      ...addressData,
      isDefault: addressData.isDefault || false,
      userId: 'user_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export const addressService = new AddressService();
