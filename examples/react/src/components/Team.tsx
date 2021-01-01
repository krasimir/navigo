import React from "react";

import { useRoute } from "./navigo/NavigoReact";

export default function Team() {
  const [match] = useRoute("/about/team");
  if (match) {
    return <p>Team page</p>;
  }
  return null;
}
