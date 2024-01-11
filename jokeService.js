import axios from 'axios';
import cheerio from 'cheerio';

class JokeService {
  /**
   * Constructor for the JokeService class.
   * @param {string} jokesUrl - The URL for Chuck Norris jokes.
   */
  constructor(jokesUrl) {
    this.jokesUrl = jokesUrl;

    // Initialize the array that will contain the 101 Chuck Norris jokes
    this.jokes = [];

    // Fetch and process the jokes upon initialization
    this.getJokes();
  }

  /**
   * Asynchronous method to fetch Chuck Norris jokes from the specified URL.
   * @async
   */
  async getJokes() {
    // Set headers including User-Agent, to mimic a web browser
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Referer': 'https://www.google.com/',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    try {
      // Make an HTTP GET request to the jokes URL
      const response = await axios.get(this.jokesUrl, { headers });

      this.jokes = this.extractJokes(response.data);
    } catch (error) {
      console.error('Error fetching HTML:', error.message);
    }
  }

  /**
   * Method to retrieve a specific Chuck Norris joke by its index.
   * @param {number} jokeId - The index of the joke to retrieve.
   * @returns {string} - The Chuck Norris joke.
   */
  getJoke(jokeId) {
    return this.jokes[jokeId];
  }

  /**
   * Auxiliary method to extract Chuck Norris jokes from HTML content using Cheerio for scraping.
   * @param {string} htmlContent - The HTML content to extract jokes from.
   * @returns {string[]} - An array of Chuck Norris jokes.
   */
  extractJokes(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const jokes = [];

    /*
        Scrape the page and extract the jokes from the HTML, by class name ('m-detail--body') 
        and element of type list item ('li'). Iterate over each 'li' element within the class 'm-detail--body',
        extract the text content of the 'li' element, and remove leading/trailing whitespaces.
     */ 
    $('.m-detail--body li').each((index, element) => {
      const jokeText = $(element).text().trim();
      jokes.push(jokeText);
    });

    // If no jokes are found, i.e., the jokes array's length is empty
    if (jokes.length === 0) {
      throw new Error('No jokes found in the HTML content.');
  }

    // Return the array of jokes
    return jokes;
  }
}

export default JokeService;