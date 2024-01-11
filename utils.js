import iso6391 from 'iso-639-1';

class Utils {
  /**
   * Extracts the language code based on the provided language name.
   * @param {string} languageName - The name of the language.
   * @returns {string|null} - The ISO 639-1 language code or null if not found.
   */
  static extractLanguageCode(languageName) {
    // Find the language code based on the language name
    const languageCode = iso6391.getCode(languageName);
    return languageCode;
  }
}

export default Utils;