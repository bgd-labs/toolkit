# @bgd-labs/toolbox

## 0.2.12

### Patch Changes

- a2d13eb: Fixed browser build

## 0.2.11

### Patch Changes

- 010ca6b: Add repository info

## 0.2.10

### Patch Changes

- 1aef7d9: Next try

## 0.2.9

### Patch Changes

- d8d550f: Regenerate ecosystem

## 0.2.8

### Patch Changes

- 415e39d: Differentiate svr feeds into AAVE SVR and SVR.

## 0.2.7

### Patch Changes

- faaeb2d: Wrong imports again

## 0.2.6

### Patch Changes

- f88bcc6: Patch import

## 0.2.5

### Patch Changes

- 825897c: Added price feed abis

## 0.2.4

### Patch Changes

- fdc4845: Use Viem 2.45.0 with megaeth network support

## 0.2.3

### Patch Changes

- f0eb4a6: Added MegaEth network

## 0.2.2

### Patch Changes

- 574a436: Added safe abi

## 0.2.1

### Patch Changes

- cf341d7: Update abis for 3.6

## 0.2.0

### Minor Changes

- 837382f: Added snapshot-org client

## 0.1.3

### Patch Changes

- ec5d570: Add parseFrontmatterMd export

## 0.1.2

### Patch Changes

- 53f85ea: Make "snapshot" validation in validateAIP less strict

## 0.1.1

### Patch Changes

- e36a85c: aip validation returns also content now

## 0.1.0

### Minor Changes

- 928a84e: Return AIP meta from `validateAip`

## 0.0.57

### Patch Changes

- ec44730: Removed arktype

## 0.0.56

### Patch Changes

- 5e30467: Migrated to tsdown

## 0.0.55

### Patch Changes

- 77f05bc: - BREAKING CHANGE: getClient returns a PublicClient, no longer just Client. This is breaking but should make usage a bit less painful.
  - improved types accross the board
  - added claude code generated docs
  - aligned viem & typescript versions so docs don't break so often
  - add helper to get full reserve configuration (we do this ad hoc on address-book, aave-proposals and custom scripts which is annoying)

## 0.0.54

### Patch Changes

- 811427e: Add Interest Rate Default V2 interface abi

## 0.0.53

### Patch Changes

- b96276f: Fix seatbelt

## 0.0.52

### Patch Changes

- 9b74ab9: Add xlayer vlidation logic

## 0.0.51

### Patch Changes

- 37f8edf: Add xLayer to chainIds

## 0.0.50

### Patch Changes

- 544480a: Add abi for Incentivized ERC20 contract

## 0.0.49

### Patch Changes

- f45be4c: Add Umbrella IRewardsDistributor abi

## 0.0.48

### Patch Changes

- 0193215: Add Umbrella PausableUpgradeable and IRewardsController abis

## 0.0.47

### Patch Changes

- 200d4d2: Regenerated plasma.

## 0.0.46

### Patch Changes

- 7389a42: Adds ink public url

## 0.0.45

### Patch Changes

- 7de3dcb: Make the report ping thenderly if there is unknown addresses

## 0.0.44

### Patch Changes

- f19b05e: Added tenderly explorer names
- 93db6eb: Regenerate artifacts for plasma support

## 0.0.43

### Patch Changes

- fbf18e6: Regenerate artifacts for plasma support

## 0.0.42

### Patch Changes

- 7cd58cd: Added IAccessControl Ownable and IERC1967

## 0.0.41

### Patch Changes

- b8bb205: Adds plasma chain

## 0.0.40

### Patch Changes

- c32a491: Adds aave vnet to accept custom payloadsController and increase timeout in tenderly client

## 0.0.39

### Patch Changes

- b14ad0c: Added tenderly rpc support.

## 0.0.38

### Patch Changes

- b1934c0: Seatbelt should report error on error, not throw.

## 0.0.37

### Patch Changes

- f9c4738: Handle another edge case

## 0.0.36

### Patch Changes

- 92faaac: Handle edge case of null object

## 0.0.35

### Patch Changes

- c95892f: Added null guard on primitive replacer

## 0.0.34

### Patch Changes

- 9a13be6: Deterministic sorting of addresses on report

## 0.0.33

### Patch Changes

- 74f4a40: Use naming util from address book"

## 0.0.32

### Patch Changes

- 37741f1: Added address flagging

## 0.0.31

### Patch Changes

- 5db8fc0: Fixed commander params

## 0.0.30

### Patch Changes

- 04b5f87: Improved the formatting of seatbelt reports.

## 0.0.29

### Patch Changes

- b593829: Added ability to deploy bytecode on seatbelt script

## 0.0.28

### Patch Changes

- 67958eb: Upgraded to Aave v3.4

## 0.0.27

### Patch Changes

- e31d13b: Added seatbelt report cli

## 0.0.26

### Patch Changes

- 1c94252: Adding more utility functions for seatbelt

## 0.0.25

### Patch Changes

- f9d0434: Fixes codeDiffs to always diff file against the most similar file when the file name is same

## 0.0.24

### Patch Changes

- d9f342a: Added codediff support for blockscout.

## 0.0.23

### Patch Changes

- 2263a85: Fix broken api urls.

## 0.0.22

### Patch Changes

- 9fce04f: Added blockscout instances

## 0.0.21

### Patch Changes

- 8892e5a: Added tenderly state diff helper.

## 0.0.20

### Patch Changes

- f7a5a0b: Addition of BOB ChainId

## 0.0.19

### Patch Changes

- a20e1a6: Added more types

## 0.0.18

### Patch Changes

- bb8d246: Downgrade prettier

## 0.0.17

### Patch Changes

- 8d290ab: Downgrade tsup

## 0.0.16

### Patch Changes

- 19f7dc3: Changed default explorer for avalanche from snowtrace to snowscan
- 08ba2f3: Added hyperrpc support on rpc helpers

## 0.0.15

### Patch Changes

- 4124268: Added more helpers for fetching pool addresses.

## 0.0.14

### Patch Changes

- 860389d: Batched fixes in various areas

## 0.0.13

### Patch Changes

- 2bd926b: Fixed node build

## 0.0.12

### Patch Changes

- 53d70ad: Added node specific entry point

## 0.0.11

### Patch Changes

- 1045494: Added chainlink feeds

## 0.0.10

### Patch Changes

- f114262: Added mev helpers & various other improvements

## 0.0.9

### Patch Changes

- 71a6b59: Added tenderly sim binding

## 0.0.8

### Patch Changes

- caf7e2a: Fixed tenderly rpc selection

## 0.0.7

### Patch Changes

- fe99d08: Added ink chain

## 0.0.6

### Patch Changes

- 1156f86: Migrated rpcs cli from @bgd-labs/rpc-env

## 0.0.5

### Patch Changes

- ed9e7a4: Added rpc-env functionality

## 0.0.4

### Patch Changes

- 8edb9dd: Added a utility function and cli task for diffing storage

## 0.0.3

### Patch Changes

- ce42a5b: Fixed the build

## 0.0.2

### Patch Changes

- 87366b0: Added an initial cli supporting vnets

## 0.0.1

### Patch Changes

- 945ac5e: Add some functionality and test changesets
- d06dbca: Adding bigint based pool-math/ray-math libraries.
