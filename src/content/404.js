import React from "react";
import Layout from "../components/Layout";
import "../styles/404.scss";

const NotFoundPage = () => (
  <Layout>
    <div className="pageNotFound  container">
      <h1 className="pageNotFound-title">NOT FOUND</h1>
      <p className="pageNotFound-description">{`
(___________________________()6 \`-,
(   ______________________   /''"\`
//\\                      //\\
"" ""                     "" ""
      `}</p>

      <a href='/'> Bring it on home </a>
    </div>
  </Layout>
);

export function Head() {
  return (
    <title>Page Not Found</title>
  )
}

export default NotFoundPage;
