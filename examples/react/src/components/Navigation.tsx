import React from "react";
import styled from "styled-components";

import { useRouter } from "./navigo/NavigoReact";

const Link = styled.a`
  display: inline-block;
  margin-right: 1em;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  text-decoration: underline;
`;

export default function Navigation() {
  const [router] = useRouter();

  return (
    <nav>
      <Link href="/" data-navigo>
        Home
      </Link>
      <Link href="/about" data-navigo>
        About
      </Link>
      <Link href="/about/team" data-navigo>
        Team
      </Link>
      <Link href="/products/one" data-navigo>
        One
      </Link>
      <Link onClick={() => router.navigate("/products/two")}>Two</Link>
    </nav>
  );
}
