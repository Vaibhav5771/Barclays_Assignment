import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const predictRisk = async (payload: any) => {
    const response = await axios.post(
        `${API_BASE_URL}/predict`,
        payload
    );
    return response.data;
};

export const predictRiskCSV = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
        `${API_BASE_URL}/predict_csv`,
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );

    return response.data;
};
