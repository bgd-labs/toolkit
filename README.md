# BGD Toolbox repo

This repository tries to slowly resolve two big problems that we currently have with bgd projects.

## Visibility

Most projects we have are developed by small internal teams at bgd and only touched by others on the surface.
This leads to ppl always reinventing the wheel as they are simply not aware that certain tooling **already exists**.

Another less significant problem is that while a lot of ppl in the ecosystem know about bgd, noone uses or contributes to our more generic tooling as noone even knowns they exist.
Therefore this project ships with docs that are meant to be maintained for "all things bgd".

## Consolidation

This is a problem that directly stems from the lack of visibility.
Currently we have the same tooling in x projects, and for some things like e.g. pool and ray math it is "common practice" to "just copy the code where it's needed", because we never even published it anywhere.
Therefore the goal of the `@bgd-labs/toolbox` project is to consolidate a lot of the tooling we currently have, including, but not limited to:

- `@bgd-labs/js-utils`
- `@bgd-labs/aave-cli` (already has some crossover with utils)
- `seatbelt-gov-v3` (already has some crossover with the cli)
- `catapulta-verify`
- `v3-governance-cache` (big crossover with cli & seatbelt)

Further goals would be to extract some of the generator logic of `@bgd-labs/aave-address-book` as it's useful in other projects as well.
Address book itself we might want to move to `aave-dao` scope and either deprecate or mirror on our side.

I'm not so familiar with permissions book, but might make sense to consolidate as well or at least parts of it.
