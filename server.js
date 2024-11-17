const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the "public" folder

const apiUrl = 'https://api.openai.com/v1/chat/completions';
const AI_API_KEY = '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'; // Replace with your AI API key

app.post('/generate-flashcards', async (req, res) => {
    const notes = req.body.notes;

    try {
        const response = await axios.post(
            apiUrl,
            {
                model: "gpt-4o", // Adjust to the latest model
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant."
                    },
                    {
                        role: "user",
                        content: `Generate flashcards from the following notes: ${notes}. 
                        Don't include any extra text beyond the flashcards. Separate each flashcard (which is a question with its corresponding answer) with ---
                        Mark the question card as **Q:** and the answer card as **A:**`
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${AI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Full API response:", response.data); // Log full response for debugging

        // Check if the response contains choices and text
        if (
            response.data &&
            response.data.choices &&
            response.data.choices[0] &&
            response.data.choices[0].message &&
            response.data.choices[0].message.content
        ) {
            const flashcardsText = response.data.choices[0].message.content; // Extract text content
            console.log("Flashcards text:", flashcardsText);

            // Split the flashcards by '---' and process each one
            const flashcards = flashcardsText.split('---').map((cardText) => {
                const match = cardText.match(/\*\*Q:\*\* (.*?)\n\*\*A:\*\* (.*)/); // Match **Q:** and **A:** with markdown formatting
                if (match) {
                    return { question: match[1], answer: match[2] };
                } else {
                    return null; // In case the format is not matched
                }
            }).filter(card => card !== null); // Filter out any null results

            res.json(flashcards);
            console.log("Flashcards generated:", flashcards);
        } else {
            console.error('Error: Missing or invalid text in response:', response.data);
            res.status(500).send('Error generating flashcards: Invalid response format');
        }
    } catch (error) {
        console.error('Error generating flashcards:', error.response ? error.response.data : error.message);
        res.status(500).send('Error generating flashcards');
    }
});
//                 messages: [
//                   {
//                     role: "system",
//                     content: "You are a helpful assistant."
//                   },
//                   {
//                     role: "user",
//                     content: `Generate flashcards from the following notes: ${notes}`
//                   }
//                 ],
//                 max_tokens: 500,
//                 temperature: 0.7
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${AI_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         const dataToSplit = response.data.choices[0].text;
//         if (typeof dataToSplit === 'string') {
//         const result = dataToSplit.split(' ');
//         } else {
//         console.error('Data is not a string:', dataToSplit);
//         }

//         const flashcards = response.data.choices[0].text.split('\n').map((card) => {
//             const [question, answer] = card.split('Answer: ');
//             return { question, answer };
//         });

//         res.json(flashcards);
//         console.log("Flashcards generated:", response.data.choices[0].message.content);
//     } catch (error) {
//         console.error('Error generating flashcards:', error);
//         res.status(500).send('Error generating flashcards');
//     }
// });

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
