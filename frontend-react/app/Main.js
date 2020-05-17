import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

import Header from "./components/Header";
import FlashMessages from "./components/FlashMessages";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Search from "./components/Search";
import Chat from "./components/Chat";

import Footer from "./components/Footer";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import ViewSinglePost from "./components/ViewSinglePost";
import About from "./components/About";
import Profile from "./components/Profile";
import Terms from "./components/Terms";
import NotFound from "./components/NotFound";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("janisToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("janisToken"),
      username: localStorage.getItem("janisUsername"),
      avatar: localStorage.getItem("janisAvatar"),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };
  function ourReducer(draft, action) {
    // state, action with useReducer
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      // return { loggedIn: true, flashMessages: state.flashMessages };
      case "logout":
        draft.loggedIn = false;
        return;
      // return { loggedIn: false, flashMessages: state.flashMessages };
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
      // return {
      //   loggedIn: state.loggedIn,
      //   flashMessages: state.flashMessages.concat(action.value),
      // };
      case "openSearch":
        draft.isSearchOpen = true;
        return;
      case "closeSearch":
        draft.isSearchOpen = false;
        return;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case "closeChat":
        draft.isChatOpen = false;
        return;
      case "incrementUnreadChatCount":
        draft.unreadChatCount++;
        return;
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("janisToken", state.user.token);
      localStorage.setItem("janisUsername", state.user.username);
      localStorage.setItem("janisAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("janisToken");
      localStorage.removeItem("janisUsername");
      localStorage.removeItem("janisAvatar");
    }
  }, [state.loggedIn]);

  // Check if token has expired or not
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/checkToken",
            {
              token: state.user.token,
            },
            { cancelToken: ourRequest.token }
          );
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashMessage",
              value: "Your session has expired. Please log in again.",
            });
          }
        } catch (e) {
          console.log("There was an error.");
        }
      }
      fetchResults();
      return () => {
        ourRequest.cancel();
      };
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <Search />
          </CSSTransition>
          <Chat />
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
