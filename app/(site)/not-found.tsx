import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <div className="pageNotFound  container">
      <h1 className="pageNotFound-title">NOT FOUND</h1>
      <p className="pageNotFound-description">{`
(___________________________()6 \`-,
(   ______________________   /''"\`
//\\                      //\\
"" ""                     "" ""
      `}</p>

      <a href="/"> Bring it on home </a>
    </div>
  );
}
