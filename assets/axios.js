import axios from "axios";

export default axios.create({ baseURL: "https://nuxt-blog-f4cf3-default-rtdb.firebaseio.com" });