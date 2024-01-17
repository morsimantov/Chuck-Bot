
import { Telegraf } from 'telegraf';
import Translator from './translator.js';
import JokeService from './jokeService.js';
import Utils from './utils.js';
import * as strings from '../strings.js';
import LocalSession from 'telegraf-session-local';

class ChuckBot {
    /**
     * Constructor for ChuckBot class.
     * @param {string} botToken - The token for the Telegram bot.
     */
    constructor(botToken) {
        this.bot = new Telegraf(botToken);
        this.translator = new Translator();
        this.jokeService = new JokeService(process.env.JOKE_SERVICE_URL);

        // Initialize target language code to default - English
        this.targetLanguageCode = DEFAULT_LANGUAGE_CODE;

        // Set up a local session middleware for user prefrences
        const localSession = new LocalSession({
            database: 'user_preferences.json',
            getSessionKey: (ctx) => ctx.from.id,
        });

        // Enable local session middleware
        this.bot.use(localSession.middleware());
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

        // Retrieve the user's language preference from the session
        const userLanguageCode = ctx.session.language || DEFAULT_LANGUAGE_CODE;
        this.targetLanguageCode = userLanguageCode;

        // If the message is the "start" command
        if (messageText.toLowerCase() === '/start') {
            // Set the language code to default - English
            this.targetLanguageCode = DEFAULT_LANGUAGE_CODE;
            ctx.session.language = this.targetLanguageCode;
            ctx.reply(strings.START_COMMAND_MESSAGE);
            return;
        }

        // If the message is of type "set language x"
        if (messageText.toLowerCase().includes(strings.SET_LANGUAGE_STRING)) {
            this.setLanguage(ctx, messageText);

          // If the message is numeric - a joke number   
        } else if (!isNaN(messageText)) {
            const userInputNumber = parseInt(messageText);
            this.handleJokeRequest(ctx, userInputNumber);

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
        const messageWords = messageText.split(' ');
        // Extract the last word, which is supposed to be the language name
        const languageName = messageWords[messageWords.length - 1];

        // Extract the language code from the language name
        const userLanguageCode = Utils.extractLanguageCode(languageName);

        // If the language name provided is valid, set the target language code accordingly
        if (userLanguageCode) {
            // Set the user's language preference in the session
            ctx.session.language = userLanguageCode;
            // Update the target language code directly
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
        // If the joke's number is not valid, i.e. not between 1 and 101
        if (userInputNumber < 1 || userInputNumber > 101) {
            this.replyInTargetLanguage(ctx, strings.INVALID_NUMBER_RESPONSE);
            return;
        }
        try {
            // Get the requested joke based on the user input number
            const selectedJoke = this.jokeService.getJoke(userInputNumber - 1);

            // Translate the joke to the target language and send it to the user
            this.replyInTargetLanguage(ctx, selectedJoke);
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