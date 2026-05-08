export default async function handler(req, res) {

    const GS_API_URL = "https://script.google.com/macros/s/AKfycbyAqqLvoKFvdqhZ5a93kaNUB8vrOQdvg3E82PSOihVr692vBca1JhqjSm6EXatnDgdh/exec";

    try {
        const params = new URLSearchParams(req.query);
        const gsUrl = new URL(GS_API_URL);
        params.forEach((value, key) => gsUrl.searchParams.append(key, value));

        const response = await fetch(gsUrl.toString(), {
            method: req.method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.text();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        res.status(response.status).send(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Proxy error: ' + error.message });
    }
}

export async function OPTIONS(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
}
