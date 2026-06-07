"use client";

import { useEffect } from "react";

interface RedirectShellProps {
  redirectTo: string;
}

export default function RedirectShell({ redirectTo }: RedirectShellProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [redirectTo]);

  return (
    <div className="redirect container">
      <h1 className="redirect-title">Redirecting...</h1>
      <img
        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3d4eWZ2dThuaWdnM3ZqdHdseWx1cGpxaGRjbndsMmFmcW0yMjl1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1kkxWqT5nvLXupUTwK/giphy.webp"
        alt="Computer Doggo"
      />
      <a style={{ marginTop: 40 }} href={redirectTo}>
        {" "}
        Computer Doggo taking you there!{" "}
      </a>
      <p className="redirect-description">{`
    (___________________________()6 \`-,
    (   ______________________   /''"\`
    //\\                      //\\
    "" ""                     "" ""
      `}</p>
    </div>
  );
}
