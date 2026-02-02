// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    Any: any,
    String: string,
    Int: number,
    Boolean: boolean,
    Float: number,
}

export interface Query {
    space: (Space | null)
    spaces: ((Space | null)[] | null)
    ranking: (RankingObject | null)
    proposal: (Proposal | null)
    proposals: ((Proposal | null)[] | null)
    vote: (Vote | null)
    votes: ((Vote | null)[] | null)
    aliases: ((Alias | null)[] | null)
    roles: ((Role | null)[] | null)
    follows: ((Follow | null)[] | null)
    subscriptions: ((Subscription | null)[] | null)
    users: ((User | null)[] | null)
    statements: ((Statement | null)[] | null)
    user: (User | null)
    statement: (Statement | null)
    skins: ((Item | null)[] | null)
    networks: ((Network | null)[] | null)
    validations: ((Item | null)[] | null)
    plugins: ((Item | null)[] | null)
    strategies: ((StrategyItem | null)[] | null)
    strategy: (StrategyItem | null)
    vp: (Vp | null)
    messages: ((Message | null)[] | null)
    leaderboards: ((Leaderboard | null)[] | null)
    options: ((Option | null)[] | null)
    __typename: 'Query'
}

export interface Message {
    mci: (Scalars['Int'] | null)
    id: (Scalars['String'] | null)
    ipfs: (Scalars['String'] | null)
    address: (Scalars['String'] | null)
    version: (Scalars['String'] | null)
    timestamp: (Scalars['Int'] | null)
    space: (Scalars['String'] | null)
    type: (Scalars['String'] | null)
    sig: (Scalars['String'] | null)
    receipt: (Scalars['String'] | null)
    __typename: 'Message'
}

export type OrderDirection = 'asc' | 'desc'

export interface Space {
    id: Scalars['String']
    name: (Scalars['String'] | null)
    private: (Scalars['Boolean'] | null)
    about: (Scalars['String'] | null)
    avatar: (Scalars['String'] | null)
    cover: (Scalars['String'] | null)
    terms: (Scalars['String'] | null)
    location: (Scalars['String'] | null)
    website: (Scalars['String'] | null)
    twitter: (Scalars['String'] | null)
    github: (Scalars['String'] | null)
    farcaster: (Scalars['String'] | null)
    coingecko: (Scalars['String'] | null)
    email: (Scalars['String'] | null)
    discussions: (Scalars['String'] | null)
    discourseCategory: (Scalars['Int'] | null)
    network: (Scalars['String'] | null)
    symbol: (Scalars['String'] | null)
    skin: (Scalars['String'] | null)
    skinSettings: (SkinSettings | null)
    domain: (Scalars['String'] | null)
    strategies: ((Strategy | null)[] | null)
    admins: ((Scalars['String'] | null)[] | null)
    members: ((Scalars['String'] | null)[] | null)
    moderators: ((Scalars['String'] | null)[] | null)
    filters: (SpaceFilters | null)
    plugins: (Scalars['Any'] | null)
    voting: (SpaceVoting | null)
    categories: ((Scalars['String'] | null)[] | null)
    validation: (Validation | null)
    voteValidation: (Validation | null)
    delegationPortal: (DelegationPortal | null)
    treasuries: ((Treasury | null)[] | null)
    labels: ((Label | null)[] | null)
    activeProposals: (Scalars['Int'] | null)
    proposalsCount: (Scalars['Int'] | null)
    proposalsCount1d: (Scalars['Int'] | null)
    proposalsCount7d: (Scalars['Int'] | null)
    proposalsCount30d: (Scalars['Int'] | null)
    followersCount: (Scalars['Int'] | null)
    followersCount7d: (Scalars['Int'] | null)
    votesCount: (Scalars['Int'] | null)
    votesCount7d: (Scalars['Int'] | null)
    parent: (Space | null)
    children: ((Space | null)[] | null)
    guidelines: (Scalars['String'] | null)
    template: (Scalars['String'] | null)
    verified: (Scalars['Boolean'] | null)
    flagged: (Scalars['Boolean'] | null)
    flagCode: (Scalars['Int'] | null)
    hibernated: (Scalars['Boolean'] | null)
    turbo: (Scalars['Boolean'] | null)
    turboExpiration: (Scalars['Int'] | null)
    rank: (Scalars['Float'] | null)
    boost: (BoostSettings | null)
    created: Scalars['Int']
    __typename: 'Space'
}

export interface RankingObject {
    items: ((Space | null)[] | null)
    metrics: (Metrics | null)
    __typename: 'RankingObject'
}

export interface Metrics {
    total: (Scalars['Int'] | null)
    categories: (Scalars['Any'] | null)
    __typename: 'Metrics'
}

export interface SpaceFilters {
    minScore: (Scalars['Float'] | null)
    onlyMembers: (Scalars['Boolean'] | null)
    __typename: 'SpaceFilters'
}

export interface SpaceVoting {
    delay: (Scalars['Int'] | null)
    period: (Scalars['Int'] | null)
    type: (Scalars['String'] | null)
    quorum: (Scalars['Float'] | null)
    quorumType: Scalars['String']
    blind: (Scalars['Boolean'] | null)
    hideAbstain: (Scalars['Boolean'] | null)
    privacy: (Scalars['String'] | null)
    aliased: (Scalars['Boolean'] | null)
    __typename: 'SpaceVoting'
}

export interface Proposal {
    id: Scalars['String']
    ipfs: (Scalars['String'] | null)
    author: Scalars['String']
    created: Scalars['Int']
    updated: (Scalars['Int'] | null)
    space: (Space | null)
    network: Scalars['String']
    symbol: Scalars['String']
    type: (Scalars['String'] | null)
    strategies: (Strategy | null)[]
    validation: (Validation | null)
    plugins: Scalars['Any']
    title: Scalars['String']
    body: (Scalars['String'] | null)
    discussion: Scalars['String']
    choices: (Scalars['String'] | null)[]
    labels: (Scalars['String'] | null)[]
    start: Scalars['Int']
    end: Scalars['Int']
    quorum: Scalars['Float']
    quorumType: Scalars['String']
    privacy: (Scalars['String'] | null)
    snapshot: (Scalars['Int'] | null)
    state: (Scalars['String'] | null)
    link: (Scalars['String'] | null)
    app: (Scalars['String'] | null)
    scores: ((Scalars['Float'] | null)[] | null)
    scores_by_strategy: (Scalars['Any'] | null)
    scores_state: (Scalars['String'] | null)
    scores_total: (Scalars['Float'] | null)
    scores_updated: (Scalars['Int'] | null)
    scores_total_value: (Scalars['Float'] | null)
    vp_value_by_strategy: (Scalars['Any'] | null)
    votes: (Scalars['Int'] | null)
    flagged: (Scalars['Boolean'] | null)
    flagCode: (Scalars['Int'] | null)
    __typename: 'Proposal'
}

export interface Strategy {
    name: Scalars['String']
    network: (Scalars['String'] | null)
    params: (Scalars['Any'] | null)
    __typename: 'Strategy'
}

export interface Validation {
    name: Scalars['String']
    params: (Scalars['Any'] | null)
    __typename: 'Validation'
}

export interface DelegationPortal {
    delegationType: Scalars['String']
    delegationContract: Scalars['String']
    delegationNetwork: Scalars['String']
    delegationApi: Scalars['String']
    __typename: 'DelegationPortal'
}

export interface Vote {
    id: Scalars['String']
    ipfs: (Scalars['String'] | null)
    voter: Scalars['String']
    created: Scalars['Int']
    space: Space
    proposal: (Proposal | null)
    choice: Scalars['Any']
    metadata: (Scalars['Any'] | null)
    reason: (Scalars['String'] | null)
    app: (Scalars['String'] | null)
    vp: (Scalars['Float'] | null)
    vp_by_strategy: ((Scalars['Float'] | null)[] | null)
    vp_state: (Scalars['String'] | null)
    __typename: 'Vote'
}

export interface Alias {
    id: Scalars['String']
    ipfs: (Scalars['String'] | null)
    address: Scalars['String']
    alias: Scalars['String']
    created: Scalars['Int']
    __typename: 'Alias'
}

export interface Role {
    space: (Scalars['String'] | null)
    permissions: ((Scalars['String'] | null)[] | null)
    __typename: 'Role'
}

export interface Follow {
    id: Scalars['String']
    ipfs: (Scalars['String'] | null)
    follower: Scalars['String']
    space: Space
    network: Scalars['String']
    created: Scalars['Int']
    __typename: 'Follow'
}

export interface Subscription {
    id: Scalars['String']
    ipfs: (Scalars['String'] | null)
    address: Scalars['String']
    space: Space
    created: Scalars['Int']
    __typename: 'Subscription'
}

export interface User {
    id: Scalars['String']
    ipfs: (Scalars['String'] | null)
    name: (Scalars['String'] | null)
    about: (Scalars['String'] | null)
    avatar: (Scalars['String'] | null)
    cover: (Scalars['String'] | null)
    github: (Scalars['String'] | null)
    twitter: (Scalars['String'] | null)
    lens: (Scalars['String'] | null)
    farcaster: (Scalars['String'] | null)
    created: (Scalars['Int'] | null)
    votesCount: (Scalars['Int'] | null)
    proposalsCount: (Scalars['Int'] | null)
    lastVote: (Scalars['Int'] | null)
    __typename: 'User'
}

export interface Statement {
    id: Scalars['String']
    ipfs: Scalars['String']
    space: Scalars['String']
    network: (Scalars['String'] | null)
    about: (Scalars['String'] | null)
    delegate: (Scalars['String'] | null)
    statement: (Scalars['String'] | null)
    discourse: (Scalars['String'] | null)
    status: (Scalars['String'] | null)
    source: (Scalars['String'] | null)
    created: Scalars['Int']
    updated: Scalars['Int']
    __typename: 'Statement'
}

export interface Item {
    id: Scalars['String']
    spacesCount: (Scalars['Int'] | null)
    __typename: 'Item'
}

export interface StrategyItem {
    id: Scalars['String']
    name: (Scalars['String'] | null)
    author: (Scalars['String'] | null)
    version: (Scalars['String'] | null)
    schema: (Scalars['Any'] | null)
    examples: ((Scalars['Any'] | null)[] | null)
    about: (Scalars['String'] | null)
    spacesCount: (Scalars['Int'] | null)
    verifiedSpacesCount: (Scalars['Int'] | null)
    override: (Scalars['Boolean'] | null)
    disabled: (Scalars['Boolean'] | null)
    __typename: 'StrategyItem'
}

export interface Treasury {
    name: (Scalars['String'] | null)
    address: (Scalars['String'] | null)
    network: (Scalars['String'] | null)
    __typename: 'Treasury'
}

export interface Label {
    id: (Scalars['String'] | null)
    name: (Scalars['String'] | null)
    description: (Scalars['String'] | null)
    color: (Scalars['String'] | null)
    __typename: 'Label'
}

export interface BoostSettings {
    enabled: (Scalars['Boolean'] | null)
    bribeEnabled: (Scalars['Boolean'] | null)
    __typename: 'BoostSettings'
}

export interface Vp {
    vp: (Scalars['Float'] | null)
    vp_by_strategy: ((Scalars['Float'] | null)[] | null)
    vp_state: (Scalars['String'] | null)
    __typename: 'Vp'
}

export interface Leaderboard {
    space: (Scalars['String'] | null)
    user: (Scalars['String'] | null)
    proposalsCount: (Scalars['Int'] | null)
    votesCount: (Scalars['Int'] | null)
    lastVote: (Scalars['Int'] | null)
    __typename: 'Leaderboard'
}

export interface Option {
    name: (Scalars['String'] | null)
    value: (Scalars['String'] | null)
    __typename: 'Option'
}

export interface SkinSettings {
    bg_color: (Scalars['String'] | null)
    link_color: (Scalars['String'] | null)
    text_color: (Scalars['String'] | null)
    content_color: (Scalars['String'] | null)
    border_color: (Scalars['String'] | null)
    heading_color: (Scalars['String'] | null)
    header_color: (Scalars['String'] | null)
    primary_color: (Scalars['String'] | null)
    theme: (Scalars['String'] | null)
    logo: (Scalars['String'] | null)
    __typename: 'SkinSettings'
}

export interface Network {
    id: Scalars['String']
    name: Scalars['String']
    premium: (Scalars['Boolean'] | null)
    spacesCount: (Scalars['Int'] | null)
    __typename: 'Network'
}

export interface QueryGenqlSelection{
    space?: (SpaceGenqlSelection & { __args: {id: Scalars['String']} })
    spaces?: (SpaceGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (SpaceWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    ranking?: (RankingObjectGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (RankingWhere | null)} })
    proposal?: (ProposalGenqlSelection & { __args: {id: Scalars['String']} })
    proposals?: (ProposalGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (ProposalWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    vote?: (VoteGenqlSelection & { __args: {id: Scalars['String']} })
    votes?: (VoteGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (VoteWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    aliases?: (AliasGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (AliasWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    roles?: (RoleGenqlSelection & { __args: {where: RolesWhere} })
    follows?: (FollowGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (FollowWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    subscriptions?: (SubscriptionGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (SubscriptionWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    users?: (UserGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (UsersWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    statements?: (StatementGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (StatementsWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    user?: (UserGenqlSelection & { __args: {id: Scalars['String']} })
    statement?: (StatementGenqlSelection & { __args: {id: Scalars['String']} })
    skins?: ItemGenqlSelection
    networks?: NetworkGenqlSelection
    validations?: ItemGenqlSelection
    plugins?: ItemGenqlSelection
    strategies?: StrategyItemGenqlSelection
    strategy?: (StrategyItemGenqlSelection & { __args: {id: Scalars['String']} })
    vp?: (VpGenqlSelection & { __args: {voter: Scalars['String'], space: Scalars['String'], proposal?: (Scalars['String'] | null)} })
    messages?: (MessageGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (MessageWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    leaderboards?: (LeaderboardGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (LeaderboardsWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    options?: OptionGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SpaceWhere {id?: (Scalars['String'] | null),id_in?: ((Scalars['String'] | null)[] | null),created?: (Scalars['Int'] | null),created_in?: ((Scalars['Int'] | null)[] | null),created_gt?: (Scalars['Int'] | null),created_gte?: (Scalars['Int'] | null),created_lt?: (Scalars['Int'] | null),created_lte?: (Scalars['Int'] | null),strategy?: (Scalars['String'] | null),plugin?: (Scalars['String'] | null),controller?: (Scalars['String'] | null),verified?: (Scalars['Boolean'] | null),domain?: (Scalars['String'] | null),search?: (Scalars['String'] | null)}

export interface RankingWhere {search?: (Scalars['String'] | null),category?: (Scalars['String'] | null),network?: (Scalars['String'] | null),strategy?: (Scalars['String'] | null),plugin?: (Scalars['String'] | null)}

export interface MessageWhere {id?: (Scalars['String'] | null),id_in?: ((Scalars['String'] | null)[] | null),mci?: (Scalars['Int'] | null),mci_in?: ((Scalars['Int'] | null)[] | null),mci_gt?: (Scalars['Int'] | null),mci_gte?: (Scalars['Int'] | null),mci_lt?: (Scalars['Int'] | null),mci_lte?: (Scalars['Int'] | null),address?: (Scalars['String'] | null),address_in?: ((Scalars['String'] | null)[] | null),timestamp?: (Scalars['Int'] | null),timestamp_in?: ((Scalars['Int'] | null)[] | null),timestamp_gt?: (Scalars['Int'] | null),timestamp_gte?: (Scalars['Int'] | null),timestamp_lt?: (Scalars['Int'] | null),timestamp_lte?: (Scalars['Int'] | null),space?: (Scalars['String'] | null),space_in?: ((Scalars['String'] | null)[] | null),type?: (Scalars['String'] | null),type_in?: ((Scalars['String'] | null)[] | null)}

export interface MessageGenqlSelection{
    mci?: boolean | number
    id?: boolean | number
    ipfs?: boolean | number
    address?: boolean | number
    version?: boolean | number
    timestamp?: boolean | number
    space?: boolean | number
    type?: boolean | number
    sig?: boolean | number
    receipt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ProposalWhere {id?: (Scalars['String'] | null),id_in?: ((Scalars['String'] | null)[] | null),ipfs?: (Scalars['String'] | null),ipfs_in?: ((Scalars['String'] | null)[] | null),space?: (Scalars['String'] | null),space_in?: ((Scalars['String'] | null)[] | null),author?: (Scalars['String'] | null),author_in?: ((Scalars['String'] | null)[] | null),network?: (Scalars['String'] | null),network_in?: ((Scalars['String'] | null)[] | null),title_contains?: (Scalars['String'] | null),strategies_contains?: (Scalars['String'] | null),plugins_contains?: (Scalars['String'] | null),validation?: (Scalars['String'] | null),type?: (Scalars['String'] | null),type_in?: ((Scalars['String'] | null)[] | null),app?: (Scalars['String'] | null),app_not?: (Scalars['String'] | null),app_in?: ((Scalars['String'] | null)[] | null),app_not_in?: ((Scalars['String'] | null)[] | null),created?: (Scalars['Int'] | null),created_in?: ((Scalars['Int'] | null)[] | null),created_gt?: (Scalars['Int'] | null),created_gte?: (Scalars['Int'] | null),created_lt?: (Scalars['Int'] | null),created_lte?: (Scalars['Int'] | null),updated?: (Scalars['Int'] | null),updated_in?: ((Scalars['Int'] | null)[] | null),updated_gt?: (Scalars['Int'] | null),updated_gte?: (Scalars['Int'] | null),updated_lt?: (Scalars['Int'] | null),updated_lte?: (Scalars['Int'] | null),start?: (Scalars['Int'] | null),start_in?: ((Scalars['Int'] | null)[] | null),start_gt?: (Scalars['Int'] | null),start_gte?: (Scalars['Int'] | null),start_lt?: (Scalars['Int'] | null),start_lte?: (Scalars['Int'] | null),end?: (Scalars['Int'] | null),end_in?: ((Scalars['Int'] | null)[] | null),end_gt?: (Scalars['Int'] | null),end_gte?: (Scalars['Int'] | null),end_lt?: (Scalars['Int'] | null),end_lte?: (Scalars['Int'] | null),scores_state?: (Scalars['String'] | null),scores_state_in?: ((Scalars['String'] | null)[] | null),labels_in?: ((Scalars['String'] | null)[] | null),state?: (Scalars['String'] | null),space_verified?: (Scalars['Boolean'] | null),flagged?: (Scalars['Boolean'] | null),votes?: (Scalars['Int'] | null),votes_gt?: (Scalars['Int'] | null),votes_gte?: (Scalars['Int'] | null),votes_lt?: (Scalars['Int'] | null),votes_lte?: (Scalars['Int'] | null),scores_total_value?: (Scalars['Float'] | null),scores_total_value_in?: ((Scalars['Float'] | null)[] | null),scores_total_value_gt?: (Scalars['Float'] | null),scores_total_value_gte?: (Scalars['Float'] | null),scores_total_value_lt?: (Scalars['Float'] | null),scores_total_value_lte?: (Scalars['Float'] | null)}

export interface VoteWhere {id?: (Scalars['String'] | null),id_in?: ((Scalars['String'] | null)[] | null),ipfs?: (Scalars['String'] | null),ipfs_in?: ((Scalars['String'] | null)[] | null),space?: (Scalars['String'] | null),space_in?: ((Scalars['String'] | null)[] | null),voter?: (Scalars['String'] | null),voter_in?: ((Scalars['String'] | null)[] | null),proposal?: (Scalars['String'] | null),proposal_in?: ((Scalars['String'] | null)[] | null),reason?: (Scalars['String'] | null),reason_not?: (Scalars['String'] | null),reason_in?: ((Scalars['String'] | null)[] | null),reason_not_in?: ((Scalars['String'] | null)[] | null),app?: (Scalars['String'] | null),app_not?: (Scalars['String'] | null),app_in?: ((Scalars['String'] | null)[] | null),app_not_in?: ((Scalars['String'] | null)[] | null),created?: (Scalars['Int'] | null),created_in?: ((Scalars['Int'] | null)[] | null),created_gt?: (Scalars['Int'] | null),created_gte?: (Scalars['Int'] | null),created_lt?: (Scalars['Int'] | null),created_lte?: (Scalars['Int'] | null),vp?: (Scalars['Float'] | null),vp_in?: ((Scalars['Float'] | null)[] | null),vp_gt?: (Scalars['Float'] | null),vp_gte?: (Scalars['Float'] | null),vp_lt?: (Scalars['Float'] | null),vp_lte?: (Scalars['Float'] | null),vp_state?: (Scalars['String'] | null),vp_state_in?: ((Scalars['String'] | null)[] | null)}

export interface AliasWhere {id?: (Scalars['String'] | null),id_in?: ((Scalars['String'] | null)[] | null),ipfs?: (Scalars['String'] | null),ipfs_in?: ((Scalars['String'] | null)[] | null),address?: (Scalars['String'] | null),address_in?: ((Scalars['String'] | null)[] | null),alias?: (Scalars['String'] | null),alias_in?: ((Scalars['String'] | null)[] | null),created?: (Scalars['Int'] | null),created_in?: ((Scalars['Int'] | null)[] | null),created_gt?: (Scalars['Int'] | null),created_gte?: (Scalars['Int'] | null),created_lt?: (Scalars['Int'] | null),created_lte?: (Scalars['Int'] | null)}

export interface RolesWhere {address: Scalars['String']}

export interface FollowWhere {id?: (Scalars['String'] | null),id_in?: ((Scalars['String'] | null)[] | null),ipfs?: (Scalars['String'] | null),ipfs_in?: ((Scalars['String'] | null)[] | null),follower?: (Scalars['String'] | null),follower_in?: ((Scalars['String'] | null)[] | null),space?: (Scalars['String'] | null),space_in?: ((Scalars['String'] | null)[] | null),network?: (Scalars['String'] | null),network_in?: ((Scalars['String'] | null)[] | null),created?: (Scalars['Int'] | null),created_in?: ((Scalars['Int'] | null)[] | null),created_gt?: (Scalars['Int'] | null),created_gte?: (Scalars['Int'] | null),created_lt?: (Scalars['Int'] | null),created_lte?: (Scalars['Int'] | null)}

export interface SubscriptionWhere {id?: (Scalars['String'] | null),id_in?: ((Scalars['String'] | null)[] | null),ipfs?: (Scalars['String'] | null),ipfs_in?: ((Scalars['String'] | null)[] | null),address?: (Scalars['String'] | null),address_in?: ((Scalars['String'] | null)[] | null),space?: (Scalars['String'] | null),space_in?: ((Scalars['String'] | null)[] | null),created?: (Scalars['Int'] | null),created_in?: ((Scalars['Int'] | null)[] | null),created_gt?: (Scalars['Int'] | null),created_gte?: (Scalars['Int'] | null),created_lt?: (Scalars['Int'] | null),created_lte?: (Scalars['Int'] | null)}

export interface UsersWhere {id?: (Scalars['String'] | null),id_in?: ((Scalars['String'] | null)[] | null),ipfs?: (Scalars['String'] | null),ipfs_in?: ((Scalars['String'] | null)[] | null),created?: (Scalars['Int'] | null),created_in?: ((Scalars['Int'] | null)[] | null),created_gt?: (Scalars['Int'] | null),created_gte?: (Scalars['Int'] | null),created_lt?: (Scalars['Int'] | null),created_lte?: (Scalars['Int'] | null)}

export interface StatementsWhere {id?: (Scalars['String'] | null),id_in?: ((Scalars['String'] | null)[] | null),ipfs?: (Scalars['String'] | null),ipfs_in?: ((Scalars['String'] | null)[] | null),space?: (Scalars['String'] | null),space_in?: ((Scalars['String'] | null)[] | null),network?: (Scalars['String'] | null),delegate?: (Scalars['String'] | null),delegate_in?: ((Scalars['String'] | null)[] | null),created?: (Scalars['Int'] | null),created_in?: ((Scalars['Int'] | null)[] | null),created_gt?: (Scalars['Int'] | null),created_gte?: (Scalars['Int'] | null),created_lt?: (Scalars['Int'] | null),created_lte?: (Scalars['Int'] | null),source?: (Scalars['String'] | null),source_in?: ((Scalars['String'] | null)[] | null)}

export interface LeaderboardsWhere {space?: (Scalars['String'] | null),space_in?: ((Scalars['String'] | null)[] | null),space_not?: (Scalars['String'] | null),space_not_in?: ((Scalars['String'] | null)[] | null),user?: (Scalars['String'] | null),user_in?: ((Scalars['String'] | null)[] | null),user_not?: (Scalars['String'] | null),user_not_in?: ((Scalars['String'] | null)[] | null),proposal_count?: (Scalars['Int'] | null),proposal_count_in?: ((Scalars['Int'] | null)[] | null),proposal_count_not?: (Scalars['Int'] | null),proposal_count_not_in?: ((Scalars['Int'] | null)[] | null),proposal_count_gt?: ((Scalars['Int'] | null)[] | null),proposal_count_gte?: ((Scalars['Int'] | null)[] | null),proposal_count_lt?: ((Scalars['Int'] | null)[] | null),proposal_count_lte?: ((Scalars['Int'] | null)[] | null),vote_count?: (Scalars['Int'] | null),vote_count_in?: ((Scalars['Int'] | null)[] | null),vote_count_not?: (Scalars['Int'] | null),vote_count_not_in?: ((Scalars['Int'] | null)[] | null),vote_count_gt?: ((Scalars['Int'] | null)[] | null),vote_count_gte?: ((Scalars['Int'] | null)[] | null),vote_count_lt?: ((Scalars['Int'] | null)[] | null),vote_count_lte?: ((Scalars['Int'] | null)[] | null)}

export interface SpaceGenqlSelection{
    id?: boolean | number
    name?: boolean | number
    private?: boolean | number
    about?: boolean | number
    avatar?: boolean | number
    cover?: boolean | number
    terms?: boolean | number
    location?: boolean | number
    website?: boolean | number
    twitter?: boolean | number
    github?: boolean | number
    farcaster?: boolean | number
    coingecko?: boolean | number
    email?: boolean | number
    discussions?: boolean | number
    discourseCategory?: boolean | number
    network?: boolean | number
    symbol?: boolean | number
    skin?: boolean | number
    skinSettings?: SkinSettingsGenqlSelection
    domain?: boolean | number
    strategies?: StrategyGenqlSelection
    admins?: boolean | number
    members?: boolean | number
    moderators?: boolean | number
    filters?: SpaceFiltersGenqlSelection
    plugins?: boolean | number
    voting?: SpaceVotingGenqlSelection
    categories?: boolean | number
    validation?: ValidationGenqlSelection
    voteValidation?: ValidationGenqlSelection
    delegationPortal?: DelegationPortalGenqlSelection
    treasuries?: TreasuryGenqlSelection
    labels?: LabelGenqlSelection
    activeProposals?: boolean | number
    proposalsCount?: boolean | number
    proposalsCount1d?: boolean | number
    proposalsCount7d?: boolean | number
    proposalsCount30d?: boolean | number
    followersCount?: boolean | number
    followersCount7d?: boolean | number
    votesCount?: boolean | number
    votesCount7d?: boolean | number
    parent?: SpaceGenqlSelection
    children?: SpaceGenqlSelection
    guidelines?: boolean | number
    template?: boolean | number
    verified?: boolean | number
    flagged?: boolean | number
    flagCode?: boolean | number
    hibernated?: boolean | number
    turbo?: boolean | number
    turboExpiration?: boolean | number
    rank?: boolean | number
    boost?: BoostSettingsGenqlSelection
    created?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface RankingObjectGenqlSelection{
    items?: SpaceGenqlSelection
    metrics?: MetricsGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MetricsGenqlSelection{
    total?: boolean | number
    categories?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SpaceFiltersGenqlSelection{
    minScore?: boolean | number
    onlyMembers?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SpaceVotingGenqlSelection{
    delay?: boolean | number
    period?: boolean | number
    type?: boolean | number
    quorum?: boolean | number
    quorumType?: boolean | number
    blind?: boolean | number
    hideAbstain?: boolean | number
    privacy?: boolean | number
    aliased?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ProposalGenqlSelection{
    id?: boolean | number
    ipfs?: boolean | number
    author?: boolean | number
    created?: boolean | number
    updated?: boolean | number
    space?: SpaceGenqlSelection
    network?: boolean | number
    symbol?: boolean | number
    type?: boolean | number
    strategies?: StrategyGenqlSelection
    validation?: ValidationGenqlSelection
    plugins?: boolean | number
    title?: boolean | number
    body?: boolean | number
    discussion?: boolean | number
    choices?: boolean | number
    labels?: boolean | number
    start?: boolean | number
    end?: boolean | number
    quorum?: boolean | number
    quorumType?: boolean | number
    privacy?: boolean | number
    snapshot?: boolean | number
    state?: boolean | number
    link?: boolean | number
    app?: boolean | number
    scores?: boolean | number
    scores_by_strategy?: boolean | number
    scores_state?: boolean | number
    scores_total?: boolean | number
    scores_updated?: boolean | number
    scores_total_value?: boolean | number
    vp_value_by_strategy?: boolean | number
    votes?: boolean | number
    flagged?: boolean | number
    flagCode?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface StrategyGenqlSelection{
    name?: boolean | number
    network?: boolean | number
    params?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ValidationGenqlSelection{
    name?: boolean | number
    params?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface DelegationPortalGenqlSelection{
    delegationType?: boolean | number
    delegationContract?: boolean | number
    delegationNetwork?: boolean | number
    delegationApi?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface VoteGenqlSelection{
    id?: boolean | number
    ipfs?: boolean | number
    voter?: boolean | number
    created?: boolean | number
    space?: SpaceGenqlSelection
    proposal?: ProposalGenqlSelection
    choice?: boolean | number
    metadata?: boolean | number
    reason?: boolean | number
    app?: boolean | number
    vp?: boolean | number
    vp_by_strategy?: boolean | number
    vp_state?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AliasGenqlSelection{
    id?: boolean | number
    ipfs?: boolean | number
    address?: boolean | number
    alias?: boolean | number
    created?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface RoleGenqlSelection{
    space?: boolean | number
    permissions?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface FollowGenqlSelection{
    id?: boolean | number
    ipfs?: boolean | number
    follower?: boolean | number
    space?: SpaceGenqlSelection
    network?: boolean | number
    created?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SubscriptionGenqlSelection{
    id?: boolean | number
    ipfs?: boolean | number
    address?: boolean | number
    space?: SpaceGenqlSelection
    created?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface UserGenqlSelection{
    id?: boolean | number
    ipfs?: boolean | number
    name?: boolean | number
    about?: boolean | number
    avatar?: boolean | number
    cover?: boolean | number
    github?: boolean | number
    twitter?: boolean | number
    lens?: boolean | number
    farcaster?: boolean | number
    created?: boolean | number
    votesCount?: boolean | number
    proposalsCount?: boolean | number
    lastVote?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface StatementGenqlSelection{
    id?: boolean | number
    ipfs?: boolean | number
    space?: boolean | number
    network?: boolean | number
    about?: boolean | number
    delegate?: boolean | number
    statement?: boolean | number
    discourse?: boolean | number
    status?: boolean | number
    source?: boolean | number
    created?: boolean | number
    updated?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ItemGenqlSelection{
    id?: boolean | number
    spacesCount?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface StrategyItemGenqlSelection{
    id?: boolean | number
    name?: boolean | number
    author?: boolean | number
    version?: boolean | number
    schema?: boolean | number
    examples?: boolean | number
    about?: boolean | number
    spacesCount?: boolean | number
    verifiedSpacesCount?: boolean | number
    override?: boolean | number
    disabled?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface TreasuryGenqlSelection{
    name?: boolean | number
    address?: boolean | number
    network?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface LabelGenqlSelection{
    id?: boolean | number
    name?: boolean | number
    description?: boolean | number
    color?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface BoostSettingsGenqlSelection{
    enabled?: boolean | number
    bribeEnabled?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface VpGenqlSelection{
    vp?: boolean | number
    vp_by_strategy?: boolean | number
    vp_state?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface LeaderboardGenqlSelection{
    space?: boolean | number
    user?: boolean | number
    proposalsCount?: boolean | number
    votesCount?: boolean | number
    lastVote?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface OptionGenqlSelection{
    name?: boolean | number
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SkinSettingsGenqlSelection{
    bg_color?: boolean | number
    link_color?: boolean | number
    text_color?: boolean | number
    content_color?: boolean | number
    border_color?: boolean | number
    heading_color?: boolean | number
    header_color?: boolean | number
    primary_color?: boolean | number
    theme?: boolean | number
    logo?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface NetworkGenqlSelection{
    id?: boolean | number
    name?: boolean | number
    premium?: boolean | number
    spacesCount?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


    const Query_possibleTypes: string[] = ['Query']
    export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
      return Query_possibleTypes.includes(obj.__typename)
    }
    


    const Message_possibleTypes: string[] = ['Message']
    export const isMessage = (obj?: { __typename?: any } | null): obj is Message => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMessage"')
      return Message_possibleTypes.includes(obj.__typename)
    }
    


    const Space_possibleTypes: string[] = ['Space']
    export const isSpace = (obj?: { __typename?: any } | null): obj is Space => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSpace"')
      return Space_possibleTypes.includes(obj.__typename)
    }
    


    const RankingObject_possibleTypes: string[] = ['RankingObject']
    export const isRankingObject = (obj?: { __typename?: any } | null): obj is RankingObject => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRankingObject"')
      return RankingObject_possibleTypes.includes(obj.__typename)
    }
    


    const Metrics_possibleTypes: string[] = ['Metrics']
    export const isMetrics = (obj?: { __typename?: any } | null): obj is Metrics => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMetrics"')
      return Metrics_possibleTypes.includes(obj.__typename)
    }
    


    const SpaceFilters_possibleTypes: string[] = ['SpaceFilters']
    export const isSpaceFilters = (obj?: { __typename?: any } | null): obj is SpaceFilters => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSpaceFilters"')
      return SpaceFilters_possibleTypes.includes(obj.__typename)
    }
    


    const SpaceVoting_possibleTypes: string[] = ['SpaceVoting']
    export const isSpaceVoting = (obj?: { __typename?: any } | null): obj is SpaceVoting => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSpaceVoting"')
      return SpaceVoting_possibleTypes.includes(obj.__typename)
    }
    


    const Proposal_possibleTypes: string[] = ['Proposal']
    export const isProposal = (obj?: { __typename?: any } | null): obj is Proposal => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProposal"')
      return Proposal_possibleTypes.includes(obj.__typename)
    }
    


    const Strategy_possibleTypes: string[] = ['Strategy']
    export const isStrategy = (obj?: { __typename?: any } | null): obj is Strategy => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isStrategy"')
      return Strategy_possibleTypes.includes(obj.__typename)
    }
    


    const Validation_possibleTypes: string[] = ['Validation']
    export const isValidation = (obj?: { __typename?: any } | null): obj is Validation => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isValidation"')
      return Validation_possibleTypes.includes(obj.__typename)
    }
    


    const DelegationPortal_possibleTypes: string[] = ['DelegationPortal']
    export const isDelegationPortal = (obj?: { __typename?: any } | null): obj is DelegationPortal => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDelegationPortal"')
      return DelegationPortal_possibleTypes.includes(obj.__typename)
    }
    


    const Vote_possibleTypes: string[] = ['Vote']
    export const isVote = (obj?: { __typename?: any } | null): obj is Vote => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isVote"')
      return Vote_possibleTypes.includes(obj.__typename)
    }
    


    const Alias_possibleTypes: string[] = ['Alias']
    export const isAlias = (obj?: { __typename?: any } | null): obj is Alias => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAlias"')
      return Alias_possibleTypes.includes(obj.__typename)
    }
    


    const Role_possibleTypes: string[] = ['Role']
    export const isRole = (obj?: { __typename?: any } | null): obj is Role => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRole"')
      return Role_possibleTypes.includes(obj.__typename)
    }
    


    const Follow_possibleTypes: string[] = ['Follow']
    export const isFollow = (obj?: { __typename?: any } | null): obj is Follow => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isFollow"')
      return Follow_possibleTypes.includes(obj.__typename)
    }
    


    const Subscription_possibleTypes: string[] = ['Subscription']
    export const isSubscription = (obj?: { __typename?: any } | null): obj is Subscription => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSubscription"')
      return Subscription_possibleTypes.includes(obj.__typename)
    }
    


    const User_possibleTypes: string[] = ['User']
    export const isUser = (obj?: { __typename?: any } | null): obj is User => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUser"')
      return User_possibleTypes.includes(obj.__typename)
    }
    


    const Statement_possibleTypes: string[] = ['Statement']
    export const isStatement = (obj?: { __typename?: any } | null): obj is Statement => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isStatement"')
      return Statement_possibleTypes.includes(obj.__typename)
    }
    


    const Item_possibleTypes: string[] = ['Item']
    export const isItem = (obj?: { __typename?: any } | null): obj is Item => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isItem"')
      return Item_possibleTypes.includes(obj.__typename)
    }
    


    const StrategyItem_possibleTypes: string[] = ['StrategyItem']
    export const isStrategyItem = (obj?: { __typename?: any } | null): obj is StrategyItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isStrategyItem"')
      return StrategyItem_possibleTypes.includes(obj.__typename)
    }
    


    const Treasury_possibleTypes: string[] = ['Treasury']
    export const isTreasury = (obj?: { __typename?: any } | null): obj is Treasury => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isTreasury"')
      return Treasury_possibleTypes.includes(obj.__typename)
    }
    


    const Label_possibleTypes: string[] = ['Label']
    export const isLabel = (obj?: { __typename?: any } | null): obj is Label => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isLabel"')
      return Label_possibleTypes.includes(obj.__typename)
    }
    


    const BoostSettings_possibleTypes: string[] = ['BoostSettings']
    export const isBoostSettings = (obj?: { __typename?: any } | null): obj is BoostSettings => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBoostSettings"')
      return BoostSettings_possibleTypes.includes(obj.__typename)
    }
    


    const Vp_possibleTypes: string[] = ['Vp']
    export const isVp = (obj?: { __typename?: any } | null): obj is Vp => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isVp"')
      return Vp_possibleTypes.includes(obj.__typename)
    }
    


    const Leaderboard_possibleTypes: string[] = ['Leaderboard']
    export const isLeaderboard = (obj?: { __typename?: any } | null): obj is Leaderboard => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isLeaderboard"')
      return Leaderboard_possibleTypes.includes(obj.__typename)
    }
    


    const Option_possibleTypes: string[] = ['Option']
    export const isOption = (obj?: { __typename?: any } | null): obj is Option => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isOption"')
      return Option_possibleTypes.includes(obj.__typename)
    }
    


    const SkinSettings_possibleTypes: string[] = ['SkinSettings']
    export const isSkinSettings = (obj?: { __typename?: any } | null): obj is SkinSettings => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSkinSettings"')
      return SkinSettings_possibleTypes.includes(obj.__typename)
    }
    


    const Network_possibleTypes: string[] = ['Network']
    export const isNetwork = (obj?: { __typename?: any } | null): obj is Network => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isNetwork"')
      return Network_possibleTypes.includes(obj.__typename)
    }
    

export const enumOrderDirection = {
   asc: 'asc' as const,
   desc: 'desc' as const
}
