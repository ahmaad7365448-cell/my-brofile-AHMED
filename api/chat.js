export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ reply: 'عذراً، مفتاح API غير مضبوط في إعدادات Vercel.' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أستطع الرد في الوقت الحالي.';

        return res.status(200).json({ reply });
    } catch (error) {
        return res.status(500).json({ reply: 'حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي.' });
    }
}
