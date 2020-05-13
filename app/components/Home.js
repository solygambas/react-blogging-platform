import React, { useEffect } from "react";
import Page from "./Page";

function Home() {
  return (
    <Page title="Your feed">
      <h2 className="text-center">
        Hello <strong>{localStorage.getItem("janisUsername")}</strong>, your
        feed is empty.
      </h2>
      <p className="lead text-muted text-center">
        Your feed displays the latest posts from the people you follow. If you
        don&rsquo;t have any friends to follow that&rsquo;s okay; you can use
        the &ldquo;Search&rdquo; feature in the top menu bar to find content
        written by people with similar interests and then follow them.
      </p>
    </Page>
  );
}

export default Home;
