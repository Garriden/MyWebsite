// --- Server-Side Concept (Simplified Express/Node.js) ---
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// *** Database/Storage Simulation ***
// In a real app, this would be a database connection.
let globalPetCounter = 0; 
// **********************************

// 2. Enable CORS for all routes/origins
// This line tells the browser, "It's okay to accept requests from any domain."
app.use(cors()); 
//app.use(cors({origin: 'http://localhost:3000'})); // Only allow requests from the specific port your client is running on

// Endpoint 1: GET the current count
app.get('/api/get-neko-pet-count', (req, res) => {
    // In a real app: fetch count from the database
    console.log('GET request received for /api/get-neko-pet-count'); // Log Entry
    console.log('Current count before sending:', globalPetCounter); // Log Value
    res.json({ count: globalPetCounter }); 
});

// Endpoint 2: POST to increment the count
app.post('/api/increment-neko-pet-count', (req, res) => {

    console.log('POST request received for /api/increment-neko-pet-count'); // Log Entry

    // In a real app: atomically increment the count in the database
    globalPetCounter += 1;

    console.log('New count after increment:', globalPetCounter); // Log Value

    // Send the new count back so the browser can update the display immediately
    res.json({ message: 'Count incremented', newCount: globalPetCounter });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});