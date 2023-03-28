import axios from "axios";
import Cookies from "js-cookie";
import messages from "../constants/messages";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetchNumberOfFlyers = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "flyers/number");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const fetchCardsPerPage = async (pageNumber, cardsPerPage) => {
  try {
    const response = await axios.get(
      API_BASE_URL + `flyers?page=${pageNumber}&limit=${cardsPerPage}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const addFlyerLocally = (key, flyer) => {
  if (!key || !flyer)
    throw Error(messages.EXCEPTION_MESSAGES.argsNullUndefined);
  try {
    const favoriteCards = getFlyersLocally(key);
    favoriteCards.push(flyer);
    localStorage.setItem(key, JSON.stringify(favoriteCards));
  } catch (e) {
    const favoriteCards = getFlyersLocally(key);
    favoriteCards.push(flyer);
    Cookies.set(key, JSON.stringify(favoriteCards));
  }
};

const removeFlyerLocally = (key, flyer) => {
  if (!key || !flyer)
    throw Error(messages.EXCEPTION_MESSAGES.argsNullUndefined);

  try {
    const favoriteCards = getFlyersLocally(key);
    const updatedfavoriteCards = favoriteCards.filter(
      (item) =>
        !Object.keys(item).every((key) => Object.is(item[key], flyer[key]))
    );
    localStorage.setItem(key, JSON.stringify(updatedfavoriteCards));
  } catch (e) {
    const favoriteCards = getFlyersLocally(key);
    const updatedfavoriteCards = favoriteCards.filter(
      (item) =>
        !Object.keys(item).every((key) => Object.is(item[key], flyer[key]))
    );
    Cookies.set(key, JSON.stringify(updatedfavoriteCards));
  }
};

const getFlyersLocally = (key) => {
  if (!key) throw Error(messages.EXCEPTION_MESSAGES.argsNullUndefined);

  try {
    const fav = JSON.parse(localStorage.getItem(key) || []);
    return fav;
  } catch (e) {
    return JSON.parse(Cookies.get(key) || "[]");
  }
};

export {
  fetchNumberOfFlyers,
  fetchCardsPerPage,
  addFlyerLocally,
  getFlyersLocally,
  removeFlyerLocally,
};
