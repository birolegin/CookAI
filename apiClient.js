// apiClient.js

const axios = require("axios");

const endpoint = "https://synthopenaich.openai.azure.com/";
const apiKey = "7c50046562f147b89343650adf77cf34";

export const getChatResponse = async (message) => {
	try {
		const response = await axios.post(
			`${endpoint}/openai/deployments/synth4vision/completions?api-version=2022-12-01`,
			{
				prompt: message,
				max_tokens: 150,
			},
			{
				headers: {
					"Content-Type": "application/json",
					"api-key": apiKey,
				},
			}
		);
		return response.data.choices[0].text;
	} catch (error) {
		console.error("Error getting chat response:", error);
		throw error;
	}
};
