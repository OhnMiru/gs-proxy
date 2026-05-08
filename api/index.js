export default async function handler(req, res) {
    const GS_API_URL = "https://script.google.com/macros/s/AKfycbyUIiNMiUvbCpVMxJsyuveJWJzh2oEvAOn8v7RXp0_b2Wy33dHzA81dpEvh2uPhMrVV/exec";

    // CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Обработка preflight (OPTIONS) запроса
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    try {
        const gsUrl = new URL(GS_API_URL);
        
        // GET параметры добавляем в URL
        for (const [key, value] of Object.entries(req.query)) {
            gsUrl.searchParams.append(key, value);
        }

        // Настройки для fetch
        let fetchOptions = {
            method: req.method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        // Для POST запроса — данные берём из тела
        if (req.method === 'POST') {
            let bodyString = '';
            
            // Определяем формат тела запроса
            if (typeof req.body === 'string') {
                bodyString = req.body;
            } else if (req.body && typeof req.body === 'object') {
                bodyString = new URLSearchParams(req.body).toString();
            }
            
            fetchOptions.body = bodyString;
            console.log(`📤 POST запрос к ${GS_API_URL}, длина тела: ${bodyString.length}`);
        }

        const response = await fetch(gsUrl.toString(), fetchOptions);
        const data = await response.text();

        res.status(response.status).send(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy error: ' + error.message });
    }
}

export async function OPTIONS(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
}
