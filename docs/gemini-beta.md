Google AI SDK for JavaScript
The Google AI JavaScript SDK is the easiest way for JavaScript developers to build with the Gemini API. The Gemini API gives you access to Gemini models created by Google DeepMind. Gemini models are built from the ground up to be multimodal, so you can reason seamlessly across text, images, and code.

[!CAUTION] Using the Google AI SDK for JavaScript directly from a client-side app is recommended for prototyping only. If you plan to enable billing, we strongly recommend that you call the Google AI Gemini API only server-side to keep your API key safe. You risk potentially exposing your API key to malicious actors if you embed your API key directly in your JavaScript app or fetch it remotely at runtime.

Get started with the Gemini API
Go to Google AI Studio.
Login with your Google account.
Create an API key. Note that in Europe the free tier is not available.
Try the Node.js quickstart
Usage example
See the Node.js quickstart for complete code.

Install the SDK package
npm install @google/generative-ai
Initialize the model
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
Run a prompt
const prompt = "Does this look store-bought or homemade?";
const image = {
  inlineData: {
    data: Buffer.from(fs.readFileSync("cookie.png")).toString("base64"),
    mimeType: "image/png",
  },
};

const result = await model.generateContent([prompt, image]);
console.log(result.response.text());
Try out a sample app
This repository contains sample Node and web apps demonstrating how the SDK can access and utilize the Gemini model for various use cases.

To try out the sample Node app, follow these steps:

Check out this repository.
git clone https://github.com/google/generative-ai-js

Obtain an API key to use with the Google AI SDKs.

cd into the samples folder and run npm install.

Assign your API key to an environment variable: export API_KEY=MY_API_KEY.

Open the sample file you're interested in. Example: text_generation.js. In the runAll() function, comment out any samples you don't want to run.

Run the sample file. Example: node text_generation.js.