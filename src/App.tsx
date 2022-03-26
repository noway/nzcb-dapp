import { providers, Wallet } from "ethers";
import { useReducer, useState } from "react";
import { Account } from "./Account";
import { RouteContext } from "./contexts";
import { Landing } from "./Landing";
import { NewBadge } from "./NewBadge";
import { Prepare } from "./Prepare";
import { Route } from "./types";

type Props = Readonly<{}>;

type State = Readonly<{
  route: Route;
  history: Route[];
}>

type NavigateAction = Readonly<{
  type: "navigate";
  payload: Route;
}>

type BackAction = Readonly<{
  type: "back";
  payload: null;
}>

type Action = NavigateAction | BackAction;

const initialState: State = {
  route: ["landing", null],
  history: [],
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'navigate':
      return {
        history: [...state.history, state.route],
        route: action.payload,
      };
    case 'back':
      if (state.history.length > 0) {
        return {
          history: state.history.slice(0, -1),
          route: state.history[state.history.length - 1],
        };
      }
      else {
        return state;
      }
    default:
      throw new Error();
  }
}

export function App(props: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function navigate(route: Route) {
    dispatch({ type: "navigate", payload: route });
  }

  function goBack() {
    dispatch({ type: "back", payload: null });
  }

  return (
    <RouteContext.Provider value={{ route: state.route, navigate, goBack }}>
      {state.route[0] === "landing" ? <Landing /> : null}
      {state.route[0] === "account" ? <Account /> : null}
      {state.route[0] === "newbadge" ? <NewBadge /> : null}
      {state.route[0] === "prepare" ? <Prepare passURI={state.route[1].passURI} /> : null}
    </RouteContext.Provider>
  )
}