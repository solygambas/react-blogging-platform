import React, { useEffect } from "react";
import Page from "./Page";

function ViewSinglePost() {
  return (
    <Page title="Fake title">
      <div className="d-flex justify-content-between">
        <h2>Example Post Title</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <a href="#">
          <img
            className="avatar-tiny"
            src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
          />
        </a>
        Posted by <a href="#">brad</a> on 2/10/2020
      </p>

      <div className="body-content">
        <p>
          Lorem ipsum dolor sit <strong>example</strong> post adipisicing elit.
          Iure ea at esse, tempore qui possimus soluta impedit natus voluptate,
          sapiente saepe modi est pariatur. Aut voluptatibus aspernatur fugiat
          asperiores at.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae quod
          asperiores corrupti omnis qui, placeat neque modi, dignissimos, ab
          exercitationem eligendi culpa explicabo nulla tempora rem? Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Iure ea at esse, tempore
          qui possimus soluta impedit natus voluptate, sapiente saepe modi est
          pariatur. Aut voluptatibus aspernatur fugiat asperiores at.
        </p>
      </div>
    </Page>
  );
}

export default ViewSinglePost;
