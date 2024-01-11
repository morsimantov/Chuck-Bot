import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

class Translator {
    /**
     * Constructor for the Translator class.
     * Initializes the Translator with API key and endpoint from environment variables.
     */
    constructor() {
        this.apiKey = process.env.TRANSLATOR_KEY;
        this.apiEndpoint = process.env.TRANSLATOR_API_ENDPOINT;
    }

    /**
     * Main method to translate a message to a target language.
     * @param {string} message - The message to be translated.
     * @param {string} targetLanguageCode - The language code of the target language.
     * @returns {Promise<string>} - A promise that resolves to the translated text.
     */
    async translate(message, targetLanguageCode) {
        try {
            // Perform the translation using the private method
            const translationResult = await this.performTranslation(message, targetLanguageCode);
            return translationResult;
        } catch (error) {
            console.error('Translation Error:', error.message);
            throw new Error('An error occurred during translation.');
        }
    }

    /**
     * Private method to perform the actual translation using the Azure Translator API.
     * @private
     * @param {string} message - The message to be translated.
     * @param {string} targetLanguageCode - The language code of the target language.
     * @returns {Promise<string>} - A promise that resolves to the translated text.
     */
    async performTranslation(message, targetLanguageCode) {
        const location = 'global';

        const params = {
            'api-version': '3.0',
            // The target language code
            to: targetLanguageCode,
        };

        // Set the message to be translated in the request data
        const requestData = [{ text: message }];

        try {
            // Make a POST request to the translation API
            const response = await axios.post(`${this.apiEndpoint}/translate`, requestData, {
                headers: {
                    'Ocp-Apim-Subscription-Key': this.apiKey,
                    'Ocp-Apim-Subscription-Region': location,
                    'Content-type': 'application/json',
                    'X-ClientTraceId': uuidv4().toString(),
                },
                params,
                responseType: 'json',
            });

            // Return the translated text from the API response
            return response.data[0].translations[0].text;
        } catch (error) {
            console.error('Translation API Request Error:', error.message);
            throw error;
        }
    }
}

export default Translator;