import React from "react";

interface User {
  username: string;
}

const data: User = { username: "Newt" };

export function App() {
  return <h1>Hello {data.username} OwO</h1>;
}
