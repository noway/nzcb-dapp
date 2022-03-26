import { Wallet } from "ethers"

type LandingRoute = Readonly<["landing", null]>
type AccountRoute = Readonly<["account", null]>
type NewBadgeRoute = Readonly<["newbadge", null]>
type PrepareRoute = Readonly<["prepare", { passURI: string }]>

export type Route = LandingRoute | AccountRoute | NewBadgeRoute | PrepareRoute