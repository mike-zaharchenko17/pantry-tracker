import openAiClient from '../../../../openAiConfig.js';
import { db } from "../../../../firebase.js";
import { addDoc, collection } from 'firebase/firestore';

export async function GET() {
    return Response.json({"hoi": "hoi"});
}

// this is not the best design- I would ideally like to
// either create an additional endpoint or take care of database
// updates outside the API to keep everything atomic, but in the interest
// of time this API endpoint both retrieves a response from OpenAI and updates
// the database with the results
export async function POST(request) {
    try {
        const req = await request.json();
        // photo from camera sent as JSON payload
        const photoB64Encoding = req.photoB64;

        // request to openai API
        const response = await openAiClient.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Please examine this image of a pantry \
                            and identify each visible item. Count how many of \
                            each visible item is in the pantry. Return your response \
                            as an unformatted JSON string with structure {name (string, capitalized no underscores) : quantity (number)} \
                            and nothing else. Please omit any Markdown code block delimiters (```) and the json prefix from your response"
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: photoB64Encoding
                            }
                        }
                    ]
                }
            ],
            model: "gpt-4o-mini"
        });

        // returned content
        const content = response.choices[0].message.content;

        // parse raw json string into an object
        const parsedObject = JSON.parse(content);

        // log object
        console.log("In API route: ");
        console.log(parsedObject);

        // don't update the database if gpt returns error
        if ('Error' in parsedObject) {
            return new Response(JSON.stringify(parsedObject), {
                headers : {
                    "Content-Type" : "application/json"
                },
                status: 500
            });
        }

        // create an array of promises to handle all 
        // database updates asynchronously- I'm sure there's a better
        // way to do this
        let promiseArr = []; 
        for (const [k, v] of Object.entries(parsedObject)) {
            console.log(`Adding ${k} to promise array`)
            promiseArr.push(addDoc(collection(db, "pantry"), {
                name: k,
                quantity: v
            }));
        }

        await Promise.all(promiseArr);

        return new Response(JSON.stringify(parsedObject), {
            headers: {
                "Content-Type": "application/json"
            },
            status: 201
        });

    } catch (error) {
        console.error("Error in POST request:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: {
                "Content-Type": "application/json"
            },
            status: 500
        });
    }
}

