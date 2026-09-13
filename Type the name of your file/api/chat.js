export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'المفتاح غير معرّف في Vercel' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `أنت مساعد ذكاء اصطناعي للموقع الشخصي للمطور أحمد حارثة (مطور ويب وذكاء اصطناعي). أجب باختصار وأسلوب مهني بالنيابة عنه. سؤال الزائر: ${message}`
                    }]
                }]
            })
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أستطع معالجة الإجابة حالياً.";

        return res.status(200).json({ reply });
    } catch (error) {
        return res.status(500).json({ error: 'حدث خطأ في الاتصال بالخادم.' });
    }
}
