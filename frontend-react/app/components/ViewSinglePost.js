import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, Redirect } from "react-router-dom";
import Axios from "axios";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Page from "./Page";
import NotFound from "./NotFound";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ViewSinglePost() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState([]);
  const [deleteAttemptCount, setDeleteAttemptCount] = useState(0);
  const [deleteWasSuccessful, setDeleteWasSuccessful] = useState(false);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token,
        });
        setPost(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("There was an error.");
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (deleteAttemptCount) {
      const ourRequest = Axios.CancelToken.source();
      async function deletePost() {
        try {
          const response = await Axios.delete(
            `/post/${id}`,
            { data: { token: appState.user.token } },
            {
              cancelToken: ourRequest.token,
            }
          );
          if (response.data == "Success") {
            setDeleteWasSuccessful(true);
          }
        } catch (e) {
          console.log("There was an error.");
        }
      }
      deletePost();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [deleteAttemptCount]);

  if (deleteWasSuccessful) {
    appDispatch({
      type: "flashMessage",
      value: "Post was successfully deleted.",
    });
    return <Redirect to={`/profile/${appState.user.username}`} />;
  }

  if (!isLoading && !post) {
    return <NotFound />;
  }
  if (isLoading) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );
  }
  const date = new Date(post.createdDate);
  const dateFormatted = `
        ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}
        `;

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username;
    }
    return false;
  }

  function deleteHandler() {
    const areYouSure = window.confirm(
      "Do you really want to delete this post?"
    );
    if (areYouSure) {
      setDeleteAttemptCount((prev) => prev + 1);
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>

        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a
              onClick={deleteHandler}
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown
          source={post.body}
          allowedTypes={[
            "paragraph",
            "strong",
            "emphasis",
            "text",
            "heading",
            "list",
            "listItem",
          ]}
        />
      </div>
    </Page>
  );
}

export default ViewSinglePost;
