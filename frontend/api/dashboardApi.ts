import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function fetchDashboardMetrics() {
    const res = await axios.get(`${API_BASE_URL}/dashboard-metrics`);
    return res.data;
}
