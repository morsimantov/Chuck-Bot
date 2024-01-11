
import { Telegraf } from 'telegraf';
import Translator from './translator.js';
import JokeService from './jokeService.js';
import Utils from './utils.js';
import * as strings from './strings.js';

class ChuckBot {

    // URL for Chuck Norris jokes page
    static JOKES_URL = 'https://parade.com/968666/parade/chuck-norris-jokes/';

    /**
     * Constructor for ChuckBot class.
     * @param {string} botToken - The token for the Telegram bot.
     */
    constructor(botToken) {
        this.bot = new Telegraf(botToken);
        this.translator = new Translator();
        this.jokeService = new JokeService(ChuckBot.JOKES_URL);  

        // Initialize target language code to default - English
        this.targetLanguageCode = 'en';
    }

    /**
     * Start the bot and set up event listeners.
     */
    start() {
        // Upon receiving a text message, call handleTextMessage
        this.bot.on((ctx) => ctx.message, async (ctx) => this.handleTextMessage(ctx));
        this.bot.launch();
    }

    /**
     * Handle incoming text messages.
     * @param {Object} ctx - The Telegraf context object.
     */
    handleTextMessage(ctx) {
        
        const messageText = ctx.message.text;

        // If the message is of type "set language x"
        if (messageText.toLowerCase().includes(strings.SET_LANGUAGE_STRING)) {
            this.setLanguage(ctx, messageText);

        // If the message is numeric - a joke number   
        } else if (!isNaN(messageText)) {
            const userInput = parseInt(messageText);

            // If the joke's number is valid, i.e. between 1 and 101
            if (userInput >= 1 && userInput <= 101) {
                this.handleJokeRequest(ctx, userInput);
            } else {
                this.replyInTargetLanguage(ctx, strings.INVALID_NUMBER_RESPONSE);
            }

        // If the request is neither a number nor a set language command
        } else {
            this.replyInTargetLanguage(ctx, strings.INVALID_REQUEST_RESPONSE);
        }
    }

    /**
     * Set the target language based on the user input.
     * @param {Object} ctx - The Telegraf context object.
     * @param {string} messageText - The text message sent by the user.
     */
    setLanguage(ctx, messageText) {
        // Split the text into words by spaces
        const msgWords = messageText.split(' ');
        // Extract the last word, which is supposed to be the language name
        const languageName = msgWords[msgWords.length - 1];
        
        // Extract the language code from the language name
        const userLanguageCode = Utils.extractLanguageCode(languageName);

        // If the language name provided is valid, set the target language code accordingly
        if (userLanguageCode) {
            this.targetLanguageCode = userLanguageCode;
            this.replyInTargetLanguage(ctx, strings.SET_LANGUAGE_RESPONSE);
        } else {
            this.replyInTargetLanguage(ctx, strings.INVALID_LANGUAGE_RESPONSE);
        }
    }

    /**
     * Handle the user's request for a Chuck Norris joke.
     * @param {Object} ctx - The Telegraf context object.
     * @param {number} userInputNumber - The user input representing the joke number.
     */
    async handleJokeRequest(ctx, userInputNumber) {
        try {
            // Get the requested joke based on the user input number
            const selectedJoke = this.jokeService.getJoke(userInputNumber - 1);

            // Translate the joke to the target language and send it to the user
            const translatedJoke = await this.translator.translate(selectedJoke, this.targetLanguageCode);
            ctx.reply(`${translatedJoke}`);
        } catch (error) {
            console.error('Error handling joke request:', error.message);
            ctx.replyInTargetLanguage(strings.ERROR_JOKE_REQUEST);
        }
    }

    /**
     * Reply to the user in the target language.
     * @param {Object} ctx - The Telegraf context object.
     * @param {string} message - The message to be sent to the user.
     */
    async replyInTargetLanguage(ctx, message) {
        try {
            // Translate the message to the target language and send it to the user
            const translatedMessage = await this.translator.translate(message, this.targetLanguageCode);
            ctx.reply(translatedMessage);
        } catch (error) {
            console.error('Error replying in target language:', error.message);
            ctx.reply(strings.ERROR_JOKE_REQUEST);
        }
    }
}

export default ChuckBot;