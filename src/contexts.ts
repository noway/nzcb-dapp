import { createContext } from "react";
import { Route } from "./types";

export const RouteContext = createContext({
  route: ["landing", null] as Route,
  navigate: (_route: Route) => {},
  goBack: () => {},
})
