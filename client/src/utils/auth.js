const TOKEN = 'km_token';
const USER = 'km_user';
const SHOP = 'km_shop';

class Auth {

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   * @param {object} user
   */
  static authenticateUser(token, user) {
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(USER, user);
  }

  /**
   * Set user shop. Save a shop data in Local Storage
   *
   * @param {object} shop
   */
  static setShop(shop) {
    localStorage.setItem(SHOP, JSON.stringify(shop));
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return localStorage.getItem(TOKEN) !== null;
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
    localStorage.removeItem(SHOP);
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken() {
    return localStorage.getItem(TOKEN);
  }

  /**
   * Get a User JSON string value.
   *
   * @returns {string}
   */

  static getUser() {
    return localStorage.getItem(USER);
  }

    /**
   * Get a User JSON string value.
   *
   * @returns {object}
   */

  static getShop() {
    const shopStr = localStorage.getItem(SHOP);
    let shopObj = {};

    try {
      shopObj = JSON.parse(shopStr);
    }
    catch (ex) { }

    return shopObj;
  }

}

export default Auth;