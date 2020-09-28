import axios from "axios";

 const url = "http://localhost:80";
// const url = "https://uflix.world";
const api = axios.create({
  baseURL: url,
});

const getToken = () => {
  const token = localStorage.getItem("token");

  return JSON.parse(token);
};

const setToken = (token) => {
  localStorage.setItem("token", JSON.stringify(token));
};

const removeToken = () => {
  localStorage.removeItem("token");
};

const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};
const getUser = () => {
  const user = localStorage.getItem("user");
  return JSON.parse(user);
};

const removeUser = () => {
  localStorage.removeItem("user");
};

const favourateCatagories = [
  "Recents",
  "Action",
  "Comedy",
  "Crime",
  "Science Fiction",
];

const isMobile = () => {
  return window.innerWidth <= SCREEN_SIZES.mobile;
};

const catagories = [
  "Select",
  "Action",
  "Adventure",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Historical",
  "Historical fiction",
  "Horror",
  "Magical realism",
  "Mystery",
  "Paranoid Fiction",
  "Philosophical",
  "Political",
  "Romance",
  "Saga",
  "Satire",
  "Science Fiction",
  "Social",
  "Speculative",
  "Thriller",
  "Urban",
  "Western",
  "Animation",
];

const topCatagories = [
  "Adventure",
  "Thriller",
  "Horror",
  "Comedy",
  "Romance",
  "Drama",
];

const SCREEN_SIZES = {
  mobile: 900,
  hd: 1366,
  shd: 1600,
  fhd: 1920,
};

export {
  isMobile,
  SCREEN_SIZES,
  catagories,
  api,
  getToken,
  getUser,
  setToken,
  setUser,
  removeToken,
  url,
  removeUser,
  favourateCatagories,
};
