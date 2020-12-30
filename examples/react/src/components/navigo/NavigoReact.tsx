import React, { useEffect, useState } from "react";
import Navigo, { Match } from "navigo";

let router: Navigo;

function getRouter(root?: string): Navigo {
  if (router) {
    return router;
  }
  return (router = new Navigo(root || "/"));
}

export function Base({ root }: { root: string }) {
  getRouter(root);
  return null;
}

export function useRoute(path: string): [false | Match, Navigo] {
  const [match, setMatch] = useState<false | Match>(
    getRouter().matchLocation(path)
  );

  useEffect(() => {
    getRouter()
      .updatePageLinks()
      .on(
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
      getRouter().off(path);
    };
  }, []);

  return [match, getRouter()];
}
