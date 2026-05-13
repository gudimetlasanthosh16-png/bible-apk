/**
 * DIVINE LOGIC ENGINE v3.0 (Cloud-Powered Spiritual AI)
 * 🕊️ Enhanced with OpenRouter LLM (Claude 3.5 Sonnet)
 * 🔐 Security: Environment Variables utilized
 */

// Use Environment Variables for production security
// Set this in your .env file as EXPO_PUBLIC_OPENROUTER_API_KEY
const getSecureKey = () => process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

export const getAIResponse = async (userPrompt, chatHistory = [], language = 'en', bibleData = null) => {
    try {
        const apiKey = getSecureKey();
        
        // Prepare context from Bible if available (RAG - Retrieval Augmented Generation)
        let bibleContext = "";
        const targetData = (language === 'te' && bibleData?.te) ? bibleData.te : bibleData?.en;
        
        if (targetData) {
             // Quick scan for relevant verses to provide as context
             const queryWords = userPrompt.toLowerCase().split(' ').filter(w => w.length > 4);
             let contextVerses = [];
             
             // Search through books
             for (let i = 0; i < Math.min(targetData.Book.length, 15); i++) {
                 const book = targetData.Book[i];
                 if (!book) continue;
                 for (let j = 0; j < Math.min(book.Chapter.length, 5); j++) {
                     for (const v of book.Chapter[j].Verse) {
                         if (queryWords.some(w => v.Verse.toLowerCase().includes(w))) {
                             contextVerses.push(`${book.BookName || 'Book'} ${j+1}:${v.Verseid} - ${v.Verse}`);
                             if (contextVerses.length >= 4) break;
                         }
                     }
                     if (contextVerses.length >= 4) break;
                 }
                 if (contextVerses.length >= 4) break;
             }
             bibleContext = contextVerses.join("\n");
        }

        const systemPrompt = `You are a wise and compassionate Bible scholar and pastor (Spiritually known as Holy AI). Your goal is to provide spiritual guidance based ONLY on the Holy Bible. 
        
        STRICT LANGUAGE RULE:
        Current Language Setting: ${language === 'te' ? 'TELUGU' : 'ENGLISH'}.
        - If the setting is TELUGU, you MUST respond entirely in Telugu (తెలుగు). 
        - Even if the user asks in English, if the setting is TELUGU, answer in Telugu.
        - Ensure your Telugu is grammatically correct, respectful, and uses spiritual terminology appropriate for a pastor.
        
        Always include relevant Bible verses in the response.
        Current Context Verses (if relevant): ${bibleContext}
        
        IMAGE_PROMPT:
        If the user asks to "create an image", "show a picture", or "generate a visual":
        1. Provide a beautiful spiritual message.
        2. At the very end of your response, include a line in this exact format:
           IMAGE_PROMPT: [STRICTLY FOLLOW USER DESCRIPTION: Highly detailed, cinematic, high-quality, 8k, literal translation of the user's request into a visual scene]
        
        COMMENTARY_LINKS:
        If the user asks for "commentary", "exegesis", or "deeper meaning" of a verse:
        1. Provide a detailed, scholarly analysis (citing Matthew Henry, Spurgeon, or other theologians).
        2. At the very end of your response, provide a list of relevant external links in this EXACT format:
           COMMENTARY_LINKS: [{"title": "Source Name", "url": "https://link.to.commentary"}]
        
        CRITICAL: The IMAGE_PROMPT and COMMENTARY_LINKS must be on their own lines at the very end of the response.
        
        Maintain a peaceful, encouraging, and holy tone.`;

        // Try Claude first, then fallback to GPT-4o-mini for maximum reliability
        // Using stable OpenRouter model IDs for maximum uptime
        const models = [
            "anthropic/claude-3.5-sonnet", 
            "anthropic/claude-3-5-sonnet-20240620", 
            "openai/gpt-4o-mini", 
            "google/gemini-flash-1.5"
        ];
        let lastError = null;

        for (const modelId of models) {
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "HTTP-Referer": "https://bible-app.com",
                        "X-Title": "Holy Bible App", 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "model": modelId,
                        "messages": [
                            { "role": "system", "content": systemPrompt },
                            ...chatHistory.slice(-5).map(msg => ({ 
                                "role": msg.sender === 'user' ? 'user' : 'assistant', 
                                "content": msg.text 
                            })),
                            { "role": "user", "content": userPrompt }
                        ],
                        "temperature": 0.7,
                        "max_tokens": 800
                    })
                });

                const data = await response.json();
                
                if (data.error) {
                    console.warn(`Model ${modelId} failed:`, data.error.message);
                    lastError = data.error.message;
                    continue; // Try next model
                }

                let responseText = data.choices[0].message.content;
                let imageUrl = null;
                let links = [];

                // Detect Image Prompt
                if (responseText.includes("IMAGE_PROMPT:")) {
                    const parts = responseText.split("IMAGE_PROMPT:");
                    responseText = parts[0].trim();
                    let prompt = parts[1].trim();
                    prompt = prompt.replace(/['"\[\]]+/g, '');
                    const encodedPrompt = encodeURIComponent(prompt);
                    imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 10000)}&model=flux`;
                }

                // Detect Commentary Links
                if (responseText.includes("COMMENTARY_LINKS:")) {
                    const parts = responseText.split("COMMENTARY_LINKS:");
                    responseText = parts[0].trim();
                    try {
                        const linkStr = parts[1].trim();
                        links = JSON.parse(linkStr);
                    } catch (e) {
                        console.error("Link Parse Error:", e);
                    }
                }

                return {
                    text: responseText,
                    image: imageUrl,
                    links: links,
                    status: "success"
                };
            } catch (err) {
                console.warn(`Fetch error for ${modelId}:`, err);
                lastError = err.message;
                continue;
            }
        }

        throw new Error(lastError || "All AI models failed");

    } catch (error) {
        console.error("Divine Logic v3 Error:", error);
        return {
            text: language === 'en' 
                ? "I am reflecting on the Word. Please check your connection and try again." 
                : "నేను వాక్యాన్ని ధ్యానిస్తున్నాను. మీ నెట్‌వర్క్ కనెక్షన్‌ను తనిఖీ చేసి మళ్ళీ ప్రయత్నించండి.",
            status: "error"
        };
    }
};

/**
 * Divine Translator: Local Heuristics + Public Web API
 */
export const translateText = async (text, targetLang = 'te') => {
    try {
        if (!text) return "";

        // Clean text (remove excessive newlines for better API performance)
        const cleanText = text.replace(/\s+/g, ' ').trim();

        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(cleanText)}`
        );

        if (!response.ok) throw new Error("Translation service busy");

        const data = await response.json();

        // Extract all translated segments
        let translated = "";
        if (data && data[0]) {
            translated = data[0].map(item => item[0]).join("");
        }

        return translated || text;
    } catch (error) {
        console.error("Translation Error:", error);
        return text; // Fallback to original
    }
};
