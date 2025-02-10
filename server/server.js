// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { LangflowClient } from '@datastax/langflow-client';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: "https://omiiisaivoiceassistant.onrender.com" }));
app.use(bodyParser.json()); // Parse JSON request bodies

// Langflow configuration
const langflowId = '90ee7bfa-450b-4ba0-97c8-d755b85fbbf2';
const flowId = '9738c60c-03de-4a40-bb4b-6684bbb7a458';
// eslint-disable-next-line no-undef
const apiKey = process.env.LANGFLOW_API_KEY;


// Initialize the Langflow client
const dsLangflowClient = new LangflowClient({ langflowId, apiKey });


app.get('/', (req, res) => {   
    console.log('Health check');
    res.send('Hello World!');

});


// POST endpoint to process the transcript
app.post('/process-transcript', async (req, res) => {
    const { transcript } = req.body;

    if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required' });
    }

    // const response = await client.flow(flowId).run(input);

    const response = await dsLangflowClient.flow(flowId).run(transcript);
    const output = response.chatOutputText();
    // console.log('Response:', output);



    // Log the transcript (you can process or store it here as needed)
    console.log('Received transcript:', transcript);

    // Example: Send a success response
    return res.json({
        message: 'Transcript received successfully',
        transcript,
        response: output,
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
