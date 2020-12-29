import React from "react";
import styled from "styled-components";

const Link = styled.a`
  display: inline-block;
  margin-right: 1em;
  color: #fff;
  font-size: 1em;
`;

export default function Navigation() {
  return (
    <nav>
      <Link href="/" data-navigo>
        Home
      </Link>
      <Link href="/about" data-navigo>
        About
      </Link>
      <Link href="/products/one" data-navigo>
        One
      </Link>
      <Link href="/products/two" data-navigo>
        Two
      </Link>
    </nav>
  );
}
