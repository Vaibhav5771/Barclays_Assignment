import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function fetchCustomers() {
    const res = await axios.get(`${API_BASE_URL}/customers`);
    return res.data;
}
