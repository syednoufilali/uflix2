import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";

const BASE_URL = "http://localhost:80/";
//const BASE_URL = "https://uflix.world/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { authorization: "" },
});

api.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const ourLoad = () => {
  loadProgressBar(null, api);
};

const getToken = () => {
  return JSON.parse(localStorage.getItem("admin"));
};

const getRole = () => {
  return JSON.parse(localStorage.getItem("role"));
};
const getRating = async (query) => {
  const response = await axios.get(
    "https://www.omdbapi.com/?t=" +
      encodeURIComponent(query) +
      "&apikey=5873c6cf"
  );
  return response.data.imdbRating;
};

export { api, getToken, ourLoad, getRating, BASE_URL, getRole };
