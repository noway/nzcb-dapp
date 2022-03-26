import { createContext } from "react";
import { Route } from "./types";

type RouteContext = {
  route: Route;
  setRoute: (_route: Route) => void;
}
export const RouteContext = createContext<RouteContext>({
  route: ["landing", null],
  setRoute: (_route: Route) => {} ,
})
