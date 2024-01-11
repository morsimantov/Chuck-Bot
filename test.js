const { Telegraf } = require('telegraf');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const cheerio = require('cheerio');
const chuckNorrisJokesUrl = 'https://parade.com/968666/parade/chuck-norris-jokes/';
require('dotenv').config();

let targetLanguage = 'en'; // Default language is English

class ChuckBot {
    constructor(botToken, azureTranslationApiKey, azureTranslationApiEndpoint) {
        this.bot = new Telegraf(botToken);
        this.azureTranslationApiKey = azureTranslationApiKey;
        this.azureTranslationApiEndpoint = azureTranslationApiEndpoint;
        this.targetLanguageCode = 'en'; // Default language is English
        this.jokesUrl = 'https://parade.com/968666/parade/chuck-norris-jokes/';
    }

    start() {
        this.bot.on(ctx => ctx.message, async (ctx) => this.handleTextMessage(ctx));

        this.bot.launch();
    }

    handleTextMessage(ctx) {
        const messageText = ctx.message.text;

        // Check if the message contains a pattern to set the language
        if (messageText.toLowerCase().includes('set language')) {
            const userLanguageCode = this.extractLanguageCode(messageText);

            if (userLanguageCode) {
                // console.log(userLanguageCode);
                this.targetLanguageCode = userLanguageCode;
                this.replyInTargetLanguage(ctx, 'No problem');
            } else {
                this.replyInTargetLanguage(ctx, 'Please provide a valid language code. Example: Set language fr');
            }
        } else {
            // Check if the message is a number between 1 and 101
            const userInput = parseInt(messageText);

            if (!Number.isNaN(userInput) && userInput >= 1 && userInput <= 101) {
                this.handleJokeRequest(ctx, userInput);
            } else {
                this.replyInTargetLanguage(ctx, 'Please enter a valid number between 1 and 101.');
            }
        }
    }

    extractLanguageCode(text) {
        // Use a regex or any other method to extract the language code from the message
        // For simplicity, let's assume the language code is the last word in the message
        const words = text.split(' ');
        return words[words.length - 1].toLowerCase();
    }


    async handleJokeRequest(ctx, userInput) {
        try {
            const url = 'https://parade.com/968666/parade/chuck-norris-jokes/';
            const apikey = '2d79b10ccc3e16ff53dc03c8747c89442eb1ce7e';
            axios({
                url: 'https://api.zenrows.com/v1/',
                method: 'GET',
                params: {
                    'url': url,
                    'apikey': apikey,
                    'js_render': 'true',
                    'premium_proxy': 'true',
                },
            })
                .then(response => this.onJokesResponse(ctx, userInput, response.data))
                .catch(error => console.log(error));

        } catch (error) {
            console.error('Error:', error.message);
            ctx.reply('An error occurred while processing your request. Please try again later.');
        }
    }

    async onJokesResponse(ctx, userInput, content) {
        const jokes = this.extractJokes(content);

        // Get the joke based on user input
        const selectedJoke = jokes[userInput - 1];

        // Translate the joke to the target language using Azure Translation API
        const translatedJoke = await this.translateJoke(selectedJoke, this.targetLanguageCode);

        // Reply with the translated joke
        ctx.reply(`${translatedJoke}`)
    }

    replyInTargetLanguage(ctx, message) {
        this.translateMessage(message, this.targetLanguageCode)
            .then((translatedMessage) => ctx.reply(translatedMessage))
            .catch((error) => {
                console.error('Translation Error:', error.message);
                ctx.reply('An error occurred while processing your request. Please try again later.');
            });
    }

    extractJokes(htmlContent) {
        // Use cheerio to parse the HTML and extract jokes
        const $ = cheerio.load(htmlContent);
        const jokes = [];

        // Adjust the selector based on the structure of the HTML page
        $('.m-detail--body li').each((index, element) => {
            const jokeText = $(element).text().trim();
            jokes.push(jokeText);
        });

        if (jokes.length === 0) {
            console.error('No jokes found in the HTML content.');
        }

        return jokes;
    }

    translateJoke(joke, targetLanguageCode) {
        return this.translateMessage(joke, targetLanguageCode);
    }
    translateMessage(message, targetLanguageCode) {
        const location = 'global';  // Replace with your Azure resource location

        const params = {
            'api-version': '3.0',
        };

        const requestData = [{
            'text': message,
        }];

        if (targetLanguageCode) {
            console.log(targetLanguageCode);
            params.to = targetLanguageCode;
        } else {
            console.error('Target language code is missing.');
            // Handle the missing target language code appropriately.
            // You might want to reply to the user or throw an error.
            return Promise.reject(new Error('Target language code is missing.'));
        }

        return axios.post(`${this.azureTranslationApiEndpoint}/translate`, requestData, {
            headers: {
                'Ocp-Apim-Subscription-Key': this.azureTranslationApiKey,
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString(),
            },
            params,
            responseType: 'json',
        }).then((response) => response.data[0].translations[0].text)
            .catch((error) => {
                console.error('Translation Error:', error.message);
                console.log('API Response:', error.response.data);
                ctx.reply('An error occurred while processing your request. Please try again later.');
                // You might want to throw the error again to propagate it to the outer catch block if needed.
                throw error;
            });
    }

}

const chuckBot = new ChuckBot(process.env.BOT_TOKEN, process.env.TRANSLATOR_KEY, 'https://api.cognitive.microsofttranslator.com/');
chuckBot.start();



