import { createContext } from "react";
import { Route } from "./types";

type RouteContext = {
  route: Route;
  navigate: (_route: Route) => void;
  goBack: () => void;
}
export const RouteContext = createContext<RouteContext>({
  route: ["landing", null],
  navigate: (_route: Route) => {},
  goBack: () => {},
})
