import React, { useEffect, useState } from "react";
import Navigo, { Match } from "navigo";

let router: Navigo;

type RouterProps = {
  root?: string;
};

export function Router({ root }: RouterProps) {
  useEffect(() => {
    if (!router) {
      router = new Navigo(root || "/");
    }
  }, []);

  return null;
}

export function useRoute(path: string): [false | Match] {
  const [match, setMatch] = useState<false | Match>(false);

  useEffect(() => {
    router.on(
      path,
      (match: Match) => {
        setMatch(match);
      },
      {
        leave: done => {
          setMatch(false);
          done();
        }
      }
    );
    return () => {
      router.off(path);
    };
  }, []);

  return [match];
}
