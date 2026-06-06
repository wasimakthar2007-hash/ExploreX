const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");
const JWT_SECRET = "exploreX_super_secret_key_2026"; 
const UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_API_KEY"; // Get a free key at unsplash.com/developers

// ==========================================
// 1. JWT SECURITY MIDDLEWARE
// ==========================================
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: "Access Denied: No JWT Token Provided" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or Expired Token" });
        req.user = user;
        next();
    });
}

// Temporary Login Route to generate a JWT token for testing
app.post('/api/login', (req, res) => {
    const mockUser = { id: 1, name: "ExploreX User" };
    const token = jwt.sign(mockUser, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
});

// ==========================================
// 2. DYNAMIC MEDIA MATCHER (Reels/Photos)
// ==========================================
async function getLocationMedia(destination) {
    try {
        const response = await axios.get(`https://api.unsplash.com/search/photos`, {
            params: { query: `${destination} landmark`, orientation: 'landscape', per_page: 1 },
            headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
        });
        return response.data.results[0]?.urls?.regular || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1";
    } catch (error) {
        return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"; // Fallback cinematic image
    }
}

// ==========================================
// 3. CONVERSATIONAL AI ENGINE (Context & Memory)
// ==========================================
const exploreXSystemPrompt = `
You are the ExploreX Intelligent Conversational Assistant.
Mandates: Context awareness, memory management, human-like NLP, and intent recognition.
Output strictly in this JSON schema:
{
  "conversationalGreeting": "String (Human-like NLP response based on vibe and destination)",
  "destination": "String",
  "days": Number,
  "smartSuggestions": ["String", "String", "String"],
  "timeline": [ { "day": Number, "morning": "String", "afternoon": "String", "evening": "String" } ],
  "budgetMetrics": { "lodging": Number, "transport": Number, "food": Number }
}
`;

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: exploreXSystemPrompt,
    generationConfig: { responseMimeType: "application/json", temperature: 0.5 }
});

// Protect this route with the authenticateToken middleware
app.post('/api/generate-tour', authenticateToken, async (req, res) => {
    try {
        const { destination, days, budget, vibe, conversationHistory } = req.body;
        
        // 1. Fetch visual media (Reel/Photo)
        const mediaUrl = await getLocationMedia(destination);
        
        // 2. Inject previous multi-turn memory into the current prompt
        const memoryContext = conversationHistory && conversationHistory.length > 0 
            ? `Previous context: ${conversationHistory.join(" | ")}. ` 
            : "";
            
        const userPrompt = `${memoryContext} Create a ${days}-day ${budget} tier itinerary for ${destination} focusing on a ${vibe} experience. Provide smart suggestions for this specific location.`;
        
        // 3. Generate structured AI Response
        const result = await model.generateContent(userPrompt);
        const parsedData = JSON.parse(result.response.text());
        
        // 4. Combine AI JSON with Media Data
        res.json({
            status: "success",
            media_reel: mediaUrl,
            data: parsedData
        });
        
    } catch (error) {
        console.error("AI Engine Error:", error);
        res.status(500).json({ error: "Failed to generate itinerary" });
    }
});

app.listen(3000, () => console.log('ExploreX Enterprise Engine running on port 3000'));