import { User, FormResponse } from '../types';

const API_BASE_URL = 'https://dynamic-form-generator-9rl7.onrender.com';

export const registerUser = async (userData: User): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rollNumber: userData.rollNumber,
        name: userData.name,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to register user');
    }

    return { success: true, message: data.message || 'User registered successfully' };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
};

export const getFormStructure = async (rollNumber: string): Promise<FormResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-form?rollNumber=${rollNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch form structure');
    }

    return data;
  } catch (error) {
    console.error('Error fetching form:', error);
    throw error;
  }
};