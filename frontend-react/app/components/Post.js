import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Post(props) {
  const post = props.post;
  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Link
      onClick={props.onClick}
      to={`/post/${post._id}`}
      className="list-group-item list-group-item-action"
    >
      <img className="avatar-tiny" src={post.author.avatar} />{" "}
      <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {!props.noAuthor && <>by {post.author.username}</>} on {dateFormatted}{" "}
      </span>
    </Link>
  );
}

export default Post;
