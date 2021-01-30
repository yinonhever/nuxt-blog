import Vuex from "vuex";
import Cookie from "js-cookie";
import axios from "@/assets/axios";

const createStore = () => new Vuex.Store({
    state: {
        loadedPosts: [],
        token: null
    },
    mutations: {
        setPosts(state, payload) {
            state.loadedPosts = payload;
        },
        addPost(state, payload) {
            state.loadedPosts.push(payload);
        },
        editPost(state, editedPost) {
            const index = state.loadedPosts.findIndex(post => post.id === editedPost.id);
            state.loadedPosts[index] = editedPost;
        },
        setToken(state, token) {
            state.token = token;
        },
        clearToken(state) {
            state.token = null;
        }
    },
    actions: {
        async nuxtServerInit(vuexContext, context) {
            try {
                const { data } = await axios.get("/posts.json");
                const posts = [];
                for (let key in data) {
                    posts.push({ id: key, ...data[key] });
                }
                vuexContext.commit("setPosts", posts);
            } catch (error) {
                context.error(error);
            }
        },
        async addPost(vuexContext, payload) {
            const createdPost = { ...payload, updateDate: new Date() };
            try {
                const { data } = await axios.post(
                    `/posts.json?auth=${vuexContext.state.token}`,
                    createdPost
                );
                vuexContext.commit("addPost", { ...createdPost, id: data.name });
            } catch (error) {
                console.log(error);
            }
        },
        async editPost(vuexContext, payload) {
            try {
                await axios.put(
                    `/posts/${payload.id}.json?auth=${vuexContext.state.token}`,
                    payload
                );
                vuexContext.commit("editPost", payload);
            } catch (error) {
                console.log(error);
            }
        },
        async authUser(vuexContext, payload) {
            const url = payload.isLogin
                ? "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"
                : "https://identitytoolkit.googleapis.com/v1/accounts:signUp";
            try {
                const { data: { idToken, expiresIn } } = await axios.post(
                    `${url}?key=${process.env.firebaseAPIKey}`,
                    { ...payload.formData, returnSecureToken: true }
                );
                vuexContext.commit("setToken", idToken);

                const expirationDate = new Date(Date.now() + expiresIn * 1000).toISOString();
                Cookie.set("jwt", idToken);
                Cookie.set("expirationDate", expirationDate);
                localStorage.setItem("token", idToken);
                localStorage.setItem("expirationDate", expirationDate);

                const res = await axios.post("http://localhost:3000/api/track-data", { data: "Authenticated" });
                console.log(res);
            } catch (error) {
                console.log(error);
            }
        },
        initAuth(vuexContext, req) {
            let token, expirationDate;
            if (req) {
                if (!req.headers.cookie) return;
                const jwtCookie = req.headers.cookie
                    .split(";")
                    .find(c => c.trim().startsWith("jwt="));
                if (!jwtCookie) return;
                token = jwtCookie.split("=")[1];
                expirationDate = req.headers.cookie
                    .split(";")
                    .find(c => c.trim().startsWith("expirationDate="))
                    .split("=")[1];
            } else {
                token = localStorage.getItem("token");
                expirationDate = localStorage.getItem("expirationDate");
            }

            if (!token || !expirationDate || Date.now() > new Date(expirationDate).getTime()) {
                vuexContext.dispatch("logout");
                return;
            }
            vuexContext.commit("setToken", token);
        },
        logout(vuexContext) {
            vuexContext.commit("clearToken");
            Cookie.remove("jwt");
            Cookie.remove("expirationDate");
            if (process.client) {
                localStorage.removeItem("token");
                localStorage.removeItem("expirationDate");
            }
        }
    },
    getters: {
        loadedPosts(state) {
            return state.loadedPosts;
        },
        isAuth(state) {
            return !!state.token;
        }
    }
})

export default createStore;