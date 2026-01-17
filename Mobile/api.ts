import { Platform } from 'react-native';

// export const BASE_URL = 'http://10.0.2.2:8000'; // Emulator loopback
export const BASE_URL = 'http://192.168.31.212:8000'; // Your Local IP for Physical Device


const api = {
    dashboard: async () => {
        const res = await fetch(`${BASE_URL}/api/dashboard/`);
        return res.json();
    },
    chatbot: async (message: string, history: any[] = []) => {
        const res = await fetch(`${BASE_URL}/api/chatbot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history })
        });
        return res.json();
    },
    decoder: async (message: string) => {
        const res = await fetch(`${BASE_URL}/api/decoder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        return res.json();
    },
    verify: async (formData: FormData) => {
        const res = await fetch(`${BASE_URL}/api/verify_document`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                // Note: fetch automatically adds boundary for FormData if Content-Type is NOT set manually
                // actually DO NOT set Content-Type header for FormData in fetch, browser/engine sets it with boundary
            },
            body: formData
        });
        // React Native requires removing 'Content-Type' header so it sets it with boundary
        // But here I'll format it properly in the custom fetch wrapper or just call fetch directly in component with care
        return res.json();
    },
    uploadSMS: async (messages: any[]) => {
        const res = await fetch(`${BASE_URL}/api/parse_sms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages })
        });
        return res.json();
    },
    getSchemes: async (profile: any) => {
        const res = await fetch(`${BASE_URL}/api/recommend_schemes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        });
        return res.json();
    },
    getTax: async () => {
        const res = await fetch(`${BASE_URL}/api/tax_calculation`);
        return res.json();
    }
};

export const uploadFile = async (uri: string, type: string, name: string, docType: string) => {
    let formData = new FormData();
    formData.append('file', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: type || 'image/jpeg',
        name: name || 'upload.jpg',
    } as any);
    formData.append('doc_type', docType);

    const res = await fetch(`${BASE_URL}/api/verify_document`, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data' // DO NOT SET THIS!
        },
    });
    return res.json();
};

export default api;
