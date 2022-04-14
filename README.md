# NZ COVID Badge - Dapp repo

## Info & FAQ
Read [the website](https://nzcb.netlify.app/) for more info.

## Technical info

Create React App with `typescript` template is used. Wallet handling is done via `@web3-onboard/react`.

## Configuration

See [src/config.ts](src/config.ts) for configuration values.

## Develop
- Create `.env` file in the root directory of the project
- Populate it env variables
    - Use `.env.example` as a reference.
- Run `yarn`
- Run `yarn start`

## Update contract types
- Run `yarn compile-contract-types`

## Related repos
- [NZ COVID Badge - Dapp repo](https://github.com/noway/nzcb-dapp)
- [NZ COVID Badge - Contract repo](https://github.com/noway/nzcb)
- [NZ COVID Badge - ZK-SNARK repo](https://github.com/noway/nzcb-circom)

## License
MIT License
