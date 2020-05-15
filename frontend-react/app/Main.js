import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

import Header from "./components/Header";
import FlashMessages from "./components/FlashMessages";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Footer from "./components/Footer";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import ViewSinglePost from "./components/ViewSinglePost";
import About from "./components/About";
import Profile from "./components/Profile";
import Terms from "./components/Terms";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("janisToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("janisToken"),
      username: localStorage.getItem("janisUsername"),
      avatar: localStorage.getItem("janisAvatar"),
    },
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
          </Switch>
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
