
export const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://your-app.vercel.app', // Replace with your Vercel domain
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function setCors(res: any) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });
}
