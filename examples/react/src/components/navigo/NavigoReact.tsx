import React, { useEffect, useState } from "react";
import Navigo, { Match } from "navigo";

let router: Navigo;

function getRouter(root?: string): Navigo {
  if (router) {
    return router;
  }
  router = new Navigo(root || "/");
  // @ts-ignore
  window.router = router;
  return router;
}

export function Base({ root }: { root: string }) {
  getRouter(root);
  return null;
}

export function useRoute(path: string): [false | Match] {
  const [match, setMatch] = useState<false | Match>(
    getRouter().matchLocation(path)
  );

  useEffect(() => {
    const leave = (done: Function) => {
      setMatch(false);
      done();
    };
    if (match) {
      getRouter().navigate(path, { force: true });
      getRouter().current.route.hooks = { leave };
    }
    getRouter()
      .updatePageLinks()
      .on(
        path,
        (match: Match) => {
          setMatch(match);
        },
        { leave }
      );
    return () => {
      getRouter().off(path);
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
