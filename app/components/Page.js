import React, { useEffect } from "react";
import Container from "./Container";

function Page(props) {
  useEffect(() => {
    document.title = `${props.title} | Janis`;
    window.scrollTo(0, 0);
  }, []);
  return <Container wide={props.wide}>{props.children}</Container>;
}

export default Page;
