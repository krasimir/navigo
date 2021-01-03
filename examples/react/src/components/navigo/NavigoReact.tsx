import React, { useRef, useEffect, useState } from "react";
import Navigo, { Match } from "navigo";

let router: Navigo;

export function configureRouter(root: string) {
  getRouter(root);
}

function getRouter(root?: string): Navigo {
  if (router) {
    return router;
  }
  router = new Navigo(root || "/", { strategy: "ALL" });
  // @ts-ignore
  window.router = router;
  return router;
}

export function useRoute(path: string): [false | Match] {
  const [match, setMatch] = useState<false | Match>(false);
  const handler = useRef((match: false | Match) => {
    setMatch(match);
  });

  useEffect(() => {
    // @ts-ignore
    getRouter()
      .on(path, handler.current, {
        leave: done => {
          setMatch(false);
          done();
        }
      })
      .updatePageLinks();
    setTimeout(() => getRouter().resolve(), 0);
    return () => {
      getRouter().off(handler.current);
    };
  }, []);

  return [match];
}

export function useRouter(): [Navigo] {
  return [getRouter()];
}

export function Route({ path, children }: { path: string; children: any }) {
  const [match] = useRoute(path);
  if (match) {
    return children;
  }
  return null;
}
