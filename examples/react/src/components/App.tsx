import React from "react";
import styled from "styled-components";

import { Base, Route } from "./navigo/NavigoReact";
import Navigation from "./Navigation";
import About from "./About";
import Products from "./Products";
import Team from "./Team";

type ContainerProps = {
  padding?: string | 0;
  margin?: string | 0;
};

export const Container = styled.div<ContainerProps>`
  padding: ${props => ("padding" in props ? props.padding : "0")};
  margin: ${props => ("margin" in props ? props.margin : 0)};
`;

export default function App() {
  return (
    <Container padding="1em">
      <Base root="/app" />
      <Navigation />
      <About />
      <Team />
      <Products />
      <Route path="/about/team">
        <hr />
        Team page footer
      </Route>
    </Container>
  );
}
