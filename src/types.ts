import { Proof, PubIdentity, PublicSignals } from "./nzcpCircom";

type LandingRoute = Readonly<["landing", null]>;
type AccountRoute = Readonly<["account", null]>;
type NewBadgeRoute = Readonly<["newbadge", null]>;
type PrepareRoute = Readonly<["prepare", { passURI: string }]>;
type MintRoute = Readonly<
  [
    "mint",
    {
      passURI: string;
      publicSignals: PublicSignals;
      proof: Proof;
      pubIdentity: PubIdentity;
    }
  ]
>;

export type Route =
  | LandingRoute
  | AccountRoute
  | NewBadgeRoute
  | PrepareRoute
  | MintRoute;
