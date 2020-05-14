import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { Redirect } from "react-router-dom";

import Page from "./Page";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function CreatePost(props) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-post", {
        title,
        body,
        token: appState.user.token,
      });
      setWasSuccessful(response.data);
      console.log("New post was created");
    } catch (e) {
      console.log("There was a problem");
    }
  }
  if (wasSuccessful) {
    appDispatch({
      type: "flashMessage",
      value: "Congrats, you successfully created a post.",
    });
    return <Redirect to={`/post/${wasSuccessful}`} />;
  }

  return (
    <Page title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onChange={(e) => setBody(e.target.value)}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
}

export default CreatePost;
