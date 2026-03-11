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
    /** Returns a single space by its ID (e.g. "ens.eth") */
    space: (Space | null)
    /** Returns a list of spaces with optional filtering, ordering, and pagination */
    spaces: ((Space | null)[] | null)
    /** Returns a ranked list of spaces with aggregated metrics */
    ranking: (RankingObject | null)
    /** Returns a single proposal by its ID */
    proposal: (Proposal | null)
    /** Returns a list of proposals with optional filtering, ordering, and pagination */
    proposals: ((Proposal | null)[] | null)
    /** Returns a single vote by its ID */
    vote: (Vote | null)
    /** Returns a list of votes with optional filtering, ordering, and pagination */
    votes: ((Vote | null)[] | null)
    /** Returns a list of address aliases with optional filtering, ordering, and pagination */
    aliases: ((Alias | null)[] | null)
    /** Returns the roles and permissions for a given address */
    roles: ((Role | null)[] | null)
    /** Returns a list of space followers with optional filtering, ordering, and pagination */
    follows: ((Follow | null)[] | null)
    /** Returns a list of proposal subscriptions with optional filtering, ordering, and pagination */
    subscriptions: ((Subscription | null)[] | null)
    /** Returns a list of users with optional filtering, ordering, and pagination */
    users: ((User | null)[] | null)
    /** Returns a list of delegate statements with optional filtering, ordering, and pagination */
    statements: ((Statement | null)[] | null)
    /** Returns a single user by their address */
    user: (User | null)
    /** Returns a single delegate statement by its ID */
    statement: (Statement | null)
    /** Returns all available space skins */
    skins: ((Item | null)[] | null)
    /** Returns all supported networks */
    networks: ((Network | null)[] | null)
    /** Returns all available proposal validations */
    validations: ((Item | null)[] | null)
    /** Returns all available plugins */
    plugins: ((Item | null)[] | null)
    /** Returns all available voting strategies */
    strategies: ((StrategyItem | null)[] | null)
    /** Returns a single voting strategy by its ID */
    strategy: (StrategyItem | null)
    /** Calculates the voting power for a voter in a space, optionally for a specific proposal */
    vp: (Vp | null)
    /** Returns a list of signed messages (envelopes) with optional filtering, ordering, and pagination */
    messages: ((Message | null)[] | null)
    /** Returns leaderboard entries for spaces with optional filtering, ordering, and pagination */
    leaderboards: ((Leaderboard | null)[] | null)
    /** Returns all available configuration options */
    options: ((Option | null)[] | null)
    __typename: 'Query'
}


/** A signed message envelope submitted to the Snapshot sequencer */
export interface Message {
    /** Message counter index, used for ordering */
    mci: (Scalars['Int'] | null)
    /** Unique message identifier */
    id: (Scalars['String'] | null)
    /** IPFS content identifier */
    ipfs: (Scalars['String'] | null)
    /** Address of the message sender */
    address: (Scalars['String'] | null)
    /** Protocol version */
    version: (Scalars['String'] | null)
    /** Unix timestamp of when the message was submitted */
    timestamp: (Scalars['Int'] | null)
    /** Space ID this message belongs to */
    space: (Scalars['String'] | null)
    /** Message type (e.g. proposal, vote, delete-proposal) */
    type: (Scalars['String'] | null)
    /** Cryptographic signature */
    sig: (Scalars['String'] | null)
    /** Sequencer receipt */
    receipt: (Scalars['String'] | null)
    __typename: 'Message'
}

export type OrderDirection = 'asc' | 'desc'


/** A Snapshot space (DAO or community) with its configuration and metadata */
export interface Space {
    /** Unique identifier for the space (e.g. "ens.eth") */
    id: Scalars['String']
    /** Display name of the space */
    name: (Scalars['String'] | null)
    /** Whether the space is private */
    private: (Scalars['Boolean'] | null)
    /** Description of the space */
    about: (Scalars['String'] | null)
    /** URL of the space avatar image */
    avatar: (Scalars['String'] | null)
    /** URL of the space cover image */
    cover: (Scalars['String'] | null)
    /** URL to the space terms of service */
    terms: (Scalars['String'] | null)
    /** Physical location of the organization */
    location: (Scalars['String'] | null)
    /** Website URL */
    website: (Scalars['String'] | null)
    /** Twitter/X handle */
    twitter: (Scalars['String'] | null)
    /** GitHub organization or user */
    github: (Scalars['String'] | null)
    /** Farcaster handle */
    farcaster: (Scalars['String'] | null)
    /** CoinGecko identifier */
    coingecko: (Scalars['String'] | null)
    /** Contact email */
    email: (Scalars['String'] | null)
    /** URL to the discussions forum */
    discussions: (Scalars['String'] | null)
    /** Discourse forum category ID */
    discourseCategory: (Scalars['Int'] | null)
    /** Network ID the space primarily operates on */
    network: (Scalars['String'] | null)
    /** Token symbol used in the space */
    symbol: (Scalars['String'] | null)
    /** Custom skin/theme ID */
    skin: (Scalars['String'] | null)
    /** Custom skin settings */
    skinSettings: (SkinSettings | null)
    /** Custom domain for the space */
    domain: (Scalars['String'] | null)
    /** Voting strategies used to calculate voting power */
    strategies: ((Strategy | null)[] | null)
    /** List of admin addresses */
    admins: ((Scalars['String'] | null)[] | null)
    /** List of member addresses */
    members: ((Scalars['String'] | null)[] | null)
    /** List of moderator addresses */
    moderators: ((Scalars['String'] | null)[] | null)
    /** Proposal filters configuration */
    filters: (SpaceFilters | null)
    /** Enabled plugins configuration */
    plugins: (Scalars['Any'] | null)
    /** Voting configuration */
    voting: (SpaceVoting | null)
    /** Space categories */
    categories: ((Scalars['String'] | null)[] | null)
    /** Proposal validation strategy */
    validation: (Validation | null)
    /** Vote validation strategy */
    voteValidation: (Validation | null)
    /** Delegation portal configuration */
    delegationPortal: (DelegationPortal | null)
    /** Treasury addresses managed by the space */
    treasuries: ((Treasury | null)[] | null)
    /** Labels that can be applied to proposals */
    labels: ((Label | null)[] | null)
    /** Number of currently active proposals */
    activeProposals: (Scalars['Int'] | null)
    /** Total number of proposals */
    proposalsCount: (Scalars['Int'] | null)
    /** Number of proposals created in the last 24 hours */
    proposalsCount1d: (Scalars['Int'] | null)
    /** Number of proposals created in the last 7 days */
    proposalsCount7d: (Scalars['Int'] | null)
    /** Number of proposals created in the last 30 days */
    proposalsCount30d: (Scalars['Int'] | null)
    /** Total number of followers */
    followersCount: (Scalars['Int'] | null)
    /** Number of new followers in the last 7 days */
    followersCount7d: (Scalars['Int'] | null)
    /** Total number of votes cast */
    votesCount: (Scalars['Int'] | null)
    /** Number of votes cast in the last 7 days */
    votesCount7d: (Scalars['Int'] | null)
    /** Parent space (for sub-spaces) */
    parent: (Space | null)
    /** Child sub-spaces */
    children: ((Space | null)[] | null)
    /** Voting guidelines link */
    guidelines: (Scalars['String'] | null)
    /** Proposal template */
    template: (Scalars['String'] | null)
    /** Whether the space is verified */
    verified: (Scalars['Boolean'] | null)
    /** Whether the space has been flagged */
    flagged: (Scalars['Boolean'] | null)
    /** Flag reason code */
    flagCode: (Scalars['Int'] | null)
    /** Whether the space is hibernated (inactive) */
    hibernated: (Scalars['Boolean'] | null)
    /** Whether turbo mode is enabled */
    turbo: (Scalars['Boolean'] | null)
    /** Unix timestamp when turbo mode expires */
    turboExpiration: (Scalars['Int'] | null)
    /** Ranking score */
    rank: (Scalars['Float'] | null)
    /** Boost settings */
    boost: (BoostSettings | null)
    /** Unix timestamp of when the space was created */
    created: Scalars['Int']
    __typename: 'Space'
}


/** Ranked list of spaces with aggregated metrics */
export interface RankingObject {
    /** List of ranked spaces */
    items: ((Space | null)[] | null)
    /** Aggregated metrics for the ranking query */
    metrics: (Metrics | null)
    __typename: 'RankingObject'
}


/** Aggregated metrics for ranking queries */
export interface Metrics {
    /** Total number of spaces matching the query */
    total: (Scalars['Int'] | null)
    /** Breakdown of spaces by category */
    categories: (Scalars['Any'] | null)
    __typename: 'Metrics'
}


/** Proposal filtering configuration for a space */
export interface SpaceFilters {
    /** Minimum score required to create a proposal */
    minScore: (Scalars['Float'] | null)
    /** Whether only members can create proposals */
    onlyMembers: (Scalars['Boolean'] | null)
    __typename: 'SpaceFilters'
}


/** Voting configuration for a space */
export interface SpaceVoting {
    /** Delay in seconds before voting starts after proposal creation */
    delay: (Scalars['Int'] | null)
    /** Voting period duration in seconds */
    period: (Scalars['Int'] | null)
    /** Default voting type (e.g. single-choice, weighted) */
    type: (Scalars['String'] | null)
    /** Quorum threshold */
    quorum: (Scalars['Float'] | null)
    /** How quorum is calculated */
    quorumType: Scalars['String']
    /** Whether votes are hidden until the voting period ends */
    blind: (Scalars['Boolean'] | null)
    /** Whether the abstain option is hidden */
    hideAbstain: (Scalars['Boolean'] | null)
    /** Privacy mode for votes (e.g. shutter) */
    privacy: (Scalars['String'] | null)
    /** Whether aliased voting is enabled */
    aliased: (Scalars['Boolean'] | null)
    __typename: 'SpaceVoting'
}


/** proposal created on a space */
export interface Proposal {
    /** Unique proposal identifier */
    id: Scalars['String']
    /** IPFS content identifier */
    ipfs: (Scalars['String'] | null)
    /** Address of the proposal author */
    author: Scalars['String']
    /** Unix timestamp of when the proposal was created */
    created: Scalars['Int']
    /** Unix timestamp of the last update */
    updated: (Scalars['Int'] | null)
    /** The space this proposal belongs to */
    space: (Space | null)
    /** Network ID */
    network: Scalars['String']
    /** Token symbol */
    symbol: Scalars['String']
    /** Voting type (e.g. single-choice, approval, quadratic, ranked-choice, weighted, basic) */
    type: (Scalars['String'] | null)
    /** Voting strategies used for this proposal */
    strategies: (Strategy | null)[]
    /** Proposal validation strategy */
    validation: (Validation | null)
    /** Enabled plugins */
    plugins: Scalars['Any']
    /** Proposal title */
    title: Scalars['String']
    /** Proposal body in Markdown */
    body: (Scalars['String'] | null)
    /** URL to the discussion thread */
    discussion: Scalars['String']
    /** List of voting choices */
    choices: (Scalars['String'] | null)[]
    /** Labels applied to this proposal */
    labels: (Scalars['String'] | null)[]
    /** Unix timestamp of when voting starts */
    start: Scalars['Int']
    /** Unix timestamp of when voting ends */
    end: Scalars['Int']
    /** Quorum threshold */
    quorum: Scalars['Float']
    /** How quorum is calculated */
    quorumType: Scalars['String']
    /** Privacy mode for votes */
    privacy: (Scalars['String'] | null)
    /** Block number snapshot for voting power calculation */
    snapshot: (Scalars['Int'] | null)
    /** Current state of the proposal (active, pending, closed) */
    state: (Scalars['String'] | null)
    /** Direct link to the proposal */
    link: (Scalars['String'] | null)
    /** Application that created the proposal */
    app: (Scalars['String'] | null)
    /** Vote scores per choice */
    scores: ((Scalars['Float'] | null)[] | null)
    /** Vote scores broken down by strategy */
    scores_by_strategy: (Scalars['Any'] | null)
    /** Scoring state (e.g. final, pending) */
    scores_state: (Scalars['String'] | null)
    /** Total score across all choices */
    scores_total: (Scalars['Float'] | null)
    /** Unix timestamp of when scores were last updated */
    scores_updated: (Scalars['Int'] | null)
    /** Total monetary value of scores */
    scores_total_value: (Scalars['Float'] | null)
    /** Voting power value breakdown by strategy */
    vp_value_by_strategy: (Scalars['Any'] | null)
    /** Total number of votes */
    votes: (Scalars['Int'] | null)
    /** Whether the proposal has been flagged */
    flagged: (Scalars['Boolean'] | null)
    /** Flag reason code */
    flagCode: (Scalars['Int'] | null)
    __typename: 'Proposal'
}


/** A voting strategy used to calculate voting power */
export interface Strategy {
    /** Strategy identifier */
    name: Scalars['String']
    /** Network ID this strategy operates on */
    network: (Scalars['String'] | null)
    /** Strategy-specific parameters */
    params: (Scalars['Any'] | null)
    __typename: 'Strategy'
}


/** A validation strategy for proposals or votes */
export interface Validation {
    /** Validation identifier */
    name: Scalars['String']
    /** Validation-specific parameters */
    params: (Scalars['Any'] | null)
    __typename: 'Validation'
}


/** Delegation portal configuration */
export interface DelegationPortal {
    /** Type of delegation */
    delegationType: Scalars['String']
    /** Delegation contract address */
    delegationContract: Scalars['String']
    /** Network of the delegation contract */
    delegationNetwork: Scalars['String']
    /** API endpoint for delegation data */
    delegationApi: Scalars['String']
    __typename: 'DelegationPortal'
}


/** A vote cast on a proposal */
export interface Vote {
    /** Unique vote identifier */
    id: Scalars['String']
    /** IPFS content identifier */
    ipfs: (Scalars['String'] | null)
    /** Address of the voter */
    voter: Scalars['String']
    /** Unix timestamp of when the vote was cast */
    created: Scalars['Int']
    /** The space this vote was cast in */
    space: Space
    /** The proposal this vote was cast on */
    proposal: (Proposal | null)
    /** The voter's choice (format depends on voting type) */
    choice: Scalars['Any']
    /** Additional vote metadata */
    metadata: (Scalars['Any'] | null)
    /** Reason provided by the voter */
    reason: (Scalars['String'] | null)
    /** Application used to cast the vote */
    app: (Scalars['String'] | null)
    /** Voting power of the voter */
    vp: (Scalars['Float'] | null)
    /** Voting power broken down by strategy */
    vp_by_strategy: ((Scalars['Float'] | null)[] | null)
    /** Voting power state (e.g. final, pending) */
    vp_state: (Scalars['String'] | null)
    /** Monetary value of the voting power */
    vp_value: (Scalars['Float'] | null)
    __typename: 'Vote'
}


/** An address alias mapping */
export interface Alias {
    /** Unique alias identifier */
    id: Scalars['String']
    /** IPFS content identifier */
    ipfs: (Scalars['String'] | null)
    /** Primary address */
    address: Scalars['String']
    /** Aliased address */
    alias: Scalars['String']
    /** Unix timestamp of when the alias was created */
    created: Scalars['Int']
    __typename: 'Alias'
}


/** Role and permissions for an address in a space */
export interface Role {
    /** Space ID */
    space: (Scalars['String'] | null)
    /** List of permissions granted */
    permissions: ((Scalars['String'] | null)[] | null)
    __typename: 'Role'
}


/** A follow relationship between an address and a space */
export interface Follow {
    /** Unique follow identifier */
    id: Scalars['String']
    /** IPFS content identifier */
    ipfs: (Scalars['String'] | null)
    /** Address of the follower */
    follower: Scalars['String']
    /** The space being followed */
    space: Space
    /** Network ID */
    network: Scalars['String']
    /** Unix timestamp of when the follow was created */
    created: Scalars['Int']
    __typename: 'Follow'
}


/** A subscription to a space's proposals */
export interface Subscription {
    /** Unique subscription identifier */
    id: Scalars['String']
    /** IPFS content identifier */
    ipfs: (Scalars['String'] | null)
    /** Address of the subscriber */
    address: Scalars['String']
    /** The space being subscribed to */
    space: Space
    /** Unix timestamp of when the subscription was created */
    created: Scalars['Int']
    __typename: 'Subscription'
}


/** A Snapshot user profile */
export interface User {
    /** User address */
    id: Scalars['String']
    /** IPFS content identifier */
    ipfs: (Scalars['String'] | null)
    /** Display name */
    name: (Scalars['String'] | null)
    /** Bio or description */
    about: (Scalars['String'] | null)
    /** Avatar image URL */
    avatar: (Scalars['String'] | null)
    /** Cover image URL */
    cover: (Scalars['String'] | null)
    /** GitHub handle */
    github: (Scalars['String'] | null)
    /** Twitter/X handle */
    twitter: (Scalars['String'] | null)
    /** Lens handle */
    lens: (Scalars['String'] | null)
    /** Farcaster handle */
    farcaster: (Scalars['String'] | null)
    /** Unix timestamp of when the profile was created */
    created: (Scalars['Int'] | null)
    /** Total number of votes cast */
    votesCount: (Scalars['Int'] | null)
    /** Total number of proposals created */
    proposalsCount: (Scalars['Int'] | null)
    /** Unix timestamp of the user's most recent vote */
    lastVote: (Scalars['Int'] | null)
    __typename: 'User'
}


/** A delegate statement */
export interface Statement {
    /** Unique statement identifier */
    id: Scalars['String']
    /** IPFS content identifier */
    ipfs: Scalars['String']
    /** Space ID this statement belongs to */
    space: Scalars['String']
    /** Network ID */
    network: (Scalars['String'] | null)
    /** Short bio of the delegate */
    about: (Scalars['String'] | null)
    /** Delegate address */
    delegate: (Scalars['String'] | null)
    /** Full delegate statement text */
    statement: (Scalars['String'] | null)
    /** Discourse forum username */
    discourse: (Scalars['String'] | null)
    /** Statement status */
    status: (Scalars['String'] | null)
    /** Source of the statement */
    source: (Scalars['String'] | null)
    /** Unix timestamp of when the statement was created */
    created: Scalars['Int']
    /** Unix timestamp of the last update */
    updated: Scalars['Int']
    __typename: 'Statement'
}


/** A reusable metadata item (skin, validation, plugin) */
export interface Item {
    /** Item identifier */
    id: Scalars['String']
    /** Number of spaces using this item */
    spacesCount: (Scalars['Int'] | null)
    __typename: 'Item'
}


/** A voting strategy with full metadata */
export interface StrategyItem {
    /** Strategy identifier */
    id: Scalars['String']
    /** Display name */
    name: (Scalars['String'] | null)
    /** Strategy author */
    author: (Scalars['String'] | null)
    /** Strategy version */
    version: (Scalars['String'] | null)
    /** JSON schema for strategy parameters */
    schema: (Scalars['Any'] | null)
    /** Example configurations */
    examples: ((Scalars['Any'] | null)[] | null)
    /** Description of the strategy */
    about: (Scalars['String'] | null)
    /** Number of spaces using this strategy */
    spacesCount: (Scalars['Int'] | null)
    /** Number of verified spaces using this strategy */
    verifiedSpacesCount: (Scalars['Int'] | null)
    /** Whether voting power depend on other addresses or not */
    override: (Scalars['Boolean'] | null)
    /** Whether the strategy is disabled */
    disabled: (Scalars['Boolean'] | null)
    __typename: 'StrategyItem'
}


/** A treasury managed by a space */
export interface Treasury {
    /** Treasury display name */
    name: (Scalars['String'] | null)
    /** Treasury wallet address */
    address: (Scalars['String'] | null)
    /** Network ID the treasury is on */
    network: (Scalars['String'] | null)
    __typename: 'Treasury'
}


/** A label that can be applied to proposals */
export interface Label {
    /** Label identifier */
    id: (Scalars['String'] | null)
    /** Label display name */
    name: (Scalars['String'] | null)
    /** Label description */
    description: (Scalars['String'] | null)
    /** Hex color code */
    color: (Scalars['String'] | null)
    __typename: 'Label'
}


/** Boost settings for a space */
export interface BoostSettings {
    /** Whether boosting is enabled */
    enabled: (Scalars['Boolean'] | null)
    /** Whether bribe-based boosting is enabled */
    bribeEnabled: (Scalars['Boolean'] | null)
    __typename: 'BoostSettings'
}


/** Voting power information */
export interface Vp {
    /** Total voting power */
    vp: (Scalars['Float'] | null)
    /** Voting power broken down by strategy */
    vp_by_strategy: ((Scalars['Float'] | null)[] | null)
    /** Voting power state (e.g. final, pending) */
    vp_state: (Scalars['String'] | null)
    __typename: 'Vp'
}


/** Leaderboard entry for a user in a space */
export interface Leaderboard {
    /** Space ID */
    space: (Scalars['String'] | null)
    /** User address */
    user: (Scalars['String'] | null)
    /** Number of proposals created */
    proposalsCount: (Scalars['Int'] | null)
    /** Number of votes cast */
    votesCount: (Scalars['Int'] | null)
    /** Unix timestamp of the user's most recent vote */
    lastVote: (Scalars['Int'] | null)
    /** Monetary value of the user's voting power */
    vpValue: (Scalars['Float'] | null)
    __typename: 'Leaderboard'
}


/** A configuration option */
export interface Option {
    /** Option name */
    name: (Scalars['String'] | null)
    /** Option value */
    value: (Scalars['String'] | null)
    __typename: 'Option'
}


/** Custom theme settings for a space skin */
export interface SkinSettings {
    /** Background color */
    bg_color: (Scalars['String'] | null)
    /** Link color */
    link_color: (Scalars['String'] | null)
    /** Text color */
    text_color: (Scalars['String'] | null)
    /** Content area color */
    content_color: (Scalars['String'] | null)
    /** Border color */
    border_color: (Scalars['String'] | null)
    /** Heading color */
    heading_color: (Scalars['String'] | null)
    /** Header color */
    header_color: (Scalars['String'] | null)
    /** Primary accent color */
    primary_color: (Scalars['String'] | null)
    /** Theme name (light or dark) */
    theme: (Scalars['String'] | null)
    /** Custom logo URL */
    logo: (Scalars['String'] | null)
    __typename: 'SkinSettings'
}


/** A blockchain network */
export interface Network {
    /** Network chain ID */
    id: Scalars['String']
    /** Network display name */
    name: Scalars['String']
    /** Whether this is a premium network */
    premium: (Scalars['Boolean'] | null)
    /** Number of spaces using this network */
    spacesCount: (Scalars['Int'] | null)
    __typename: 'Network'
}

export interface QueryGenqlSelection{
    /** Returns a single space by its ID (e.g. "ens.eth") */
    space?: (SpaceGenqlSelection & { __args: {id: Scalars['String']} })
    /** Returns a list of spaces with optional filtering, ordering, and pagination */
    spaces?: (SpaceGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (SpaceWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    /** Returns a ranked list of spaces with aggregated metrics */
    ranking?: (RankingObjectGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (RankingWhere | null)} })
    /** Returns a single proposal by its ID */
    proposal?: (ProposalGenqlSelection & { __args: {id: Scalars['String']} })
    /** Returns a list of proposals with optional filtering, ordering, and pagination */
    proposals?: (ProposalGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (ProposalWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    /** Returns a single vote by its ID */
    vote?: (VoteGenqlSelection & { __args: {id: Scalars['String']} })
    /** Returns a list of votes with optional filtering, ordering, and pagination */
    votes?: (VoteGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (VoteWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    /** Returns a list of address aliases with optional filtering, ordering, and pagination */
    aliases?: (AliasGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (AliasWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    /** Returns the roles and permissions for a given address */
    roles?: (RoleGenqlSelection & { __args: {where: RolesWhere} })
    /** Returns a list of space followers with optional filtering, ordering, and pagination */
    follows?: (FollowGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (FollowWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    /** Returns a list of proposal subscriptions with optional filtering, ordering, and pagination */
    subscriptions?: (SubscriptionGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (SubscriptionWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    /** Returns a list of users with optional filtering, ordering, and pagination */
    users?: (UserGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (UsersWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    /** Returns a list of delegate statements with optional filtering, ordering, and pagination */
    statements?: (StatementGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (StatementsWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    /** Returns a single user by their address */
    user?: (UserGenqlSelection & { __args: {id: Scalars['String']} })
    /** Returns a single delegate statement by its ID */
    statement?: (StatementGenqlSelection & { __args: {id: Scalars['String']} })
    /** Returns all available space skins */
    skins?: ItemGenqlSelection
    /** Returns all supported networks */
    networks?: NetworkGenqlSelection
    /** Returns all available proposal validations */
    validations?: ItemGenqlSelection
    /** Returns all available plugins */
    plugins?: ItemGenqlSelection
    /** Returns all available voting strategies */
    strategies?: StrategyItemGenqlSelection
    /** Returns a single voting strategy by its ID */
    strategy?: (StrategyItemGenqlSelection & { __args: {id: Scalars['String']} })
    /** Calculates the voting power for a voter in a space, optionally for a specific proposal */
    vp?: (VpGenqlSelection & { __args: {voter: Scalars['String'], space: Scalars['String'], proposal?: (Scalars['String'] | null)} })
    /** Returns a list of signed messages (envelopes) with optional filtering, ordering, and pagination */
    messages?: (MessageGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (MessageWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    /** Returns leaderboard entries for spaces with optional filtering, ordering, and pagination */
    leaderboards?: (LeaderboardGenqlSelection & { __args?: {first?: Scalars['Int'], skip?: Scalars['Int'], where?: (LeaderboardsWhere | null), orderBy?: (Scalars['String'] | null), orderDirection?: (OrderDirection | null)} })
    /** Returns all available configuration options */
    options?: OptionGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SpaceWhere {id?: (Scalars['String'] | null),id_in?: ((Scalars['String'] | null)[] | null),created?: (Scalars['Int'] | null),created_in?: ((Scalars['Int'] | null)[] | null),created_gt?: (Scalars['Int'] | null),created_gte?: (Scalars['Int'] | null),created_lt?: (Scalars['Int'] | null),created_lte?: (Scalars['Int'] | null),strategy?: (Scalars['String'] | null),plugin?: (Scalars['String'] | null),controller?: (Scalars['String'] | null),verified?: (Scalars['Boolean'] | null),turbo?: (Scalars['Boolean'] | null),domain?: (Scalars['String'] | null),search?: (Scalars['String'] | null)}

export interface RankingWhere {search?: (Scalars['String'] | null),category?: (Scalars['String'] | null),network?: (Scalars['String'] | null),strategy?: (Scalars['String'] | null),plugin?: (Scalars['String'] | null)}

export interface MessageWhere {id?: (Scalars['String'] | null),id_in?: ((Scalars['String'] | null)[] | null),mci?: (Scalars['Int'] | null),mci_in?: ((Scalars['Int'] | null)[] | null),mci_gt?: (Scalars['Int'] | null),mci_gte?: (Scalars['Int'] | null),mci_lt?: (Scalars['Int'] | null),mci_lte?: (Scalars['Int'] | null),address?: (Scalars['String'] | null),address_in?: ((Scalars['String'] | null)[] | null),timestamp?: (Scalars['Int'] | null),timestamp_in?: ((Scalars['Int'] | null)[] | null),timestamp_gt?: (Scalars['Int'] | null),timestamp_gte?: (Scalars['Int'] | null),timestamp_lt?: (Scalars['Int'] | null),timestamp_lte?: (Scalars['Int'] | null),space?: (Scalars['String'] | null),space_in?: ((Scalars['String'] | null)[] | null),type?: (Scalars['String'] | null),type_in?: ((Scalars['String'] | null)[] | null)}


/** A signed message envelope submitted to the Snapshot sequencer */
export interface MessageGenqlSelection{
    /** Message counter index, used for ordering */
    mci?: boolean | number
    /** Unique message identifier */
    id?: boolean | number
    /** IPFS content identifier */
    ipfs?: boolean | number
    /** Address of the message sender */
    address?: boolean | number
    /** Protocol version */
    version?: boolean | number
    /** Unix timestamp of when the message was submitted */
    timestamp?: boolean | number
    /** Space ID this message belongs to */
    space?: boolean | number
    /** Message type (e.g. proposal, vote, delete-proposal) */
    type?: boolean | number
    /** Cryptographic signature */
    sig?: boolean | number
    /** Sequencer receipt */
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


/** A Snapshot space (DAO or community) with its configuration and metadata */
export interface SpaceGenqlSelection{
    /** Unique identifier for the space (e.g. "ens.eth") */
    id?: boolean | number
    /** Display name of the space */
    name?: boolean | number
    /** Whether the space is private */
    private?: boolean | number
    /** Description of the space */
    about?: boolean | number
    /** URL of the space avatar image */
    avatar?: boolean | number
    /** URL of the space cover image */
    cover?: boolean | number
    /** URL to the space terms of service */
    terms?: boolean | number
    /** Physical location of the organization */
    location?: boolean | number
    /** Website URL */
    website?: boolean | number
    /** Twitter/X handle */
    twitter?: boolean | number
    /** GitHub organization or user */
    github?: boolean | number
    /** Farcaster handle */
    farcaster?: boolean | number
    /** CoinGecko identifier */
    coingecko?: boolean | number
    /** Contact email */
    email?: boolean | number
    /** URL to the discussions forum */
    discussions?: boolean | number
    /** Discourse forum category ID */
    discourseCategory?: boolean | number
    /** Network ID the space primarily operates on */
    network?: boolean | number
    /** Token symbol used in the space */
    symbol?: boolean | number
    /** Custom skin/theme ID */
    skin?: boolean | number
    /** Custom skin settings */
    skinSettings?: SkinSettingsGenqlSelection
    /** Custom domain for the space */
    domain?: boolean | number
    /** Voting strategies used to calculate voting power */
    strategies?: StrategyGenqlSelection
    /** List of admin addresses */
    admins?: boolean | number
    /** List of member addresses */
    members?: boolean | number
    /** List of moderator addresses */
    moderators?: boolean | number
    /** Proposal filters configuration */
    filters?: SpaceFiltersGenqlSelection
    /** Enabled plugins configuration */
    plugins?: boolean | number
    /** Voting configuration */
    voting?: SpaceVotingGenqlSelection
    /** Space categories */
    categories?: boolean | number
    /** Proposal validation strategy */
    validation?: ValidationGenqlSelection
    /** Vote validation strategy */
    voteValidation?: ValidationGenqlSelection
    /** Delegation portal configuration */
    delegationPortal?: DelegationPortalGenqlSelection
    /** Treasury addresses managed by the space */
    treasuries?: TreasuryGenqlSelection
    /** Labels that can be applied to proposals */
    labels?: LabelGenqlSelection
    /** Number of currently active proposals */
    activeProposals?: boolean | number
    /** Total number of proposals */
    proposalsCount?: boolean | number
    /** Number of proposals created in the last 24 hours */
    proposalsCount1d?: boolean | number
    /** Number of proposals created in the last 7 days */
    proposalsCount7d?: boolean | number
    /** Number of proposals created in the last 30 days */
    proposalsCount30d?: boolean | number
    /** Total number of followers */
    followersCount?: boolean | number
    /** Number of new followers in the last 7 days */
    followersCount7d?: boolean | number
    /** Total number of votes cast */
    votesCount?: boolean | number
    /** Number of votes cast in the last 7 days */
    votesCount7d?: boolean | number
    /** Parent space (for sub-spaces) */
    parent?: SpaceGenqlSelection
    /** Child sub-spaces */
    children?: SpaceGenqlSelection
    /** Voting guidelines link */
    guidelines?: boolean | number
    /** Proposal template */
    template?: boolean | number
    /** Whether the space is verified */
    verified?: boolean | number
    /** Whether the space has been flagged */
    flagged?: boolean | number
    /** Flag reason code */
    flagCode?: boolean | number
    /** Whether the space is hibernated (inactive) */
    hibernated?: boolean | number
    /** Whether turbo mode is enabled */
    turbo?: boolean | number
    /** Unix timestamp when turbo mode expires */
    turboExpiration?: boolean | number
    /** Ranking score */
    rank?: boolean | number
    /** Boost settings */
    boost?: BoostSettingsGenqlSelection
    /** Unix timestamp of when the space was created */
    created?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Ranked list of spaces with aggregated metrics */
export interface RankingObjectGenqlSelection{
    /** List of ranked spaces */
    items?: SpaceGenqlSelection
    /** Aggregated metrics for the ranking query */
    metrics?: MetricsGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Aggregated metrics for ranking queries */
export interface MetricsGenqlSelection{
    /** Total number of spaces matching the query */
    total?: boolean | number
    /** Breakdown of spaces by category */
    categories?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Proposal filtering configuration for a space */
export interface SpaceFiltersGenqlSelection{
    /** Minimum score required to create a proposal */
    minScore?: boolean | number
    /** Whether only members can create proposals */
    onlyMembers?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Voting configuration for a space */
export interface SpaceVotingGenqlSelection{
    /** Delay in seconds before voting starts after proposal creation */
    delay?: boolean | number
    /** Voting period duration in seconds */
    period?: boolean | number
    /** Default voting type (e.g. single-choice, weighted) */
    type?: boolean | number
    /** Quorum threshold */
    quorum?: boolean | number
    /** How quorum is calculated */
    quorumType?: boolean | number
    /** Whether votes are hidden until the voting period ends */
    blind?: boolean | number
    /** Whether the abstain option is hidden */
    hideAbstain?: boolean | number
    /** Privacy mode for votes (e.g. shutter) */
    privacy?: boolean | number
    /** Whether aliased voting is enabled */
    aliased?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** proposal created on a space */
export interface ProposalGenqlSelection{
    /** Unique proposal identifier */
    id?: boolean | number
    /** IPFS content identifier */
    ipfs?: boolean | number
    /** Address of the proposal author */
    author?: boolean | number
    /** Unix timestamp of when the proposal was created */
    created?: boolean | number
    /** Unix timestamp of the last update */
    updated?: boolean | number
    /** The space this proposal belongs to */
    space?: SpaceGenqlSelection
    /** Network ID */
    network?: boolean | number
    /** Token symbol */
    symbol?: boolean | number
    /** Voting type (e.g. single-choice, approval, quadratic, ranked-choice, weighted, basic) */
    type?: boolean | number
    /** Voting strategies used for this proposal */
    strategies?: StrategyGenqlSelection
    /** Proposal validation strategy */
    validation?: ValidationGenqlSelection
    /** Enabled plugins */
    plugins?: boolean | number
    /** Proposal title */
    title?: boolean | number
    /** Proposal body in Markdown */
    body?: boolean | number
    /** URL to the discussion thread */
    discussion?: boolean | number
    /** List of voting choices */
    choices?: boolean | number
    /** Labels applied to this proposal */
    labels?: boolean | number
    /** Unix timestamp of when voting starts */
    start?: boolean | number
    /** Unix timestamp of when voting ends */
    end?: boolean | number
    /** Quorum threshold */
    quorum?: boolean | number
    /** How quorum is calculated */
    quorumType?: boolean | number
    /** Privacy mode for votes */
    privacy?: boolean | number
    /** Block number snapshot for voting power calculation */
    snapshot?: boolean | number
    /** Current state of the proposal (active, pending, closed) */
    state?: boolean | number
    /** Direct link to the proposal */
    link?: boolean | number
    /** Application that created the proposal */
    app?: boolean | number
    /** Vote scores per choice */
    scores?: boolean | number
    /** Vote scores broken down by strategy */
    scores_by_strategy?: boolean | number
    /** Scoring state (e.g. final, pending) */
    scores_state?: boolean | number
    /** Total score across all choices */
    scores_total?: boolean | number
    /** Unix timestamp of when scores were last updated */
    scores_updated?: boolean | number
    /** Total monetary value of scores */
    scores_total_value?: boolean | number
    /** Voting power value breakdown by strategy */
    vp_value_by_strategy?: boolean | number
    /** Total number of votes */
    votes?: boolean | number
    /** Whether the proposal has been flagged */
    flagged?: boolean | number
    /** Flag reason code */
    flagCode?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A voting strategy used to calculate voting power */
export interface StrategyGenqlSelection{
    /** Strategy identifier */
    name?: boolean | number
    /** Network ID this strategy operates on */
    network?: boolean | number
    /** Strategy-specific parameters */
    params?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A validation strategy for proposals or votes */
export interface ValidationGenqlSelection{
    /** Validation identifier */
    name?: boolean | number
    /** Validation-specific parameters */
    params?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Delegation portal configuration */
export interface DelegationPortalGenqlSelection{
    /** Type of delegation */
    delegationType?: boolean | number
    /** Delegation contract address */
    delegationContract?: boolean | number
    /** Network of the delegation contract */
    delegationNetwork?: boolean | number
    /** API endpoint for delegation data */
    delegationApi?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A vote cast on a proposal */
export interface VoteGenqlSelection{
    /** Unique vote identifier */
    id?: boolean | number
    /** IPFS content identifier */
    ipfs?: boolean | number
    /** Address of the voter */
    voter?: boolean | number
    /** Unix timestamp of when the vote was cast */
    created?: boolean | number
    /** The space this vote was cast in */
    space?: SpaceGenqlSelection
    /** The proposal this vote was cast on */
    proposal?: ProposalGenqlSelection
    /** The voter's choice (format depends on voting type) */
    choice?: boolean | number
    /** Additional vote metadata */
    metadata?: boolean | number
    /** Reason provided by the voter */
    reason?: boolean | number
    /** Application used to cast the vote */
    app?: boolean | number
    /** Voting power of the voter */
    vp?: boolean | number
    /** Voting power broken down by strategy */
    vp_by_strategy?: boolean | number
    /** Voting power state (e.g. final, pending) */
    vp_state?: boolean | number
    /** Monetary value of the voting power */
    vp_value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An address alias mapping */
export interface AliasGenqlSelection{
    /** Unique alias identifier */
    id?: boolean | number
    /** IPFS content identifier */
    ipfs?: boolean | number
    /** Primary address */
    address?: boolean | number
    /** Aliased address */
    alias?: boolean | number
    /** Unix timestamp of when the alias was created */
    created?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Role and permissions for an address in a space */
export interface RoleGenqlSelection{
    /** Space ID */
    space?: boolean | number
    /** List of permissions granted */
    permissions?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A follow relationship between an address and a space */
export interface FollowGenqlSelection{
    /** Unique follow identifier */
    id?: boolean | number
    /** IPFS content identifier */
    ipfs?: boolean | number
    /** Address of the follower */
    follower?: boolean | number
    /** The space being followed */
    space?: SpaceGenqlSelection
    /** Network ID */
    network?: boolean | number
    /** Unix timestamp of when the follow was created */
    created?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A subscription to a space's proposals */
export interface SubscriptionGenqlSelection{
    /** Unique subscription identifier */
    id?: boolean | number
    /** IPFS content identifier */
    ipfs?: boolean | number
    /** Address of the subscriber */
    address?: boolean | number
    /** The space being subscribed to */
    space?: SpaceGenqlSelection
    /** Unix timestamp of when the subscription was created */
    created?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A Snapshot user profile */
export interface UserGenqlSelection{
    /** User address */
    id?: boolean | number
    /** IPFS content identifier */
    ipfs?: boolean | number
    /** Display name */
    name?: boolean | number
    /** Bio or description */
    about?: boolean | number
    /** Avatar image URL */
    avatar?: boolean | number
    /** Cover image URL */
    cover?: boolean | number
    /** GitHub handle */
    github?: boolean | number
    /** Twitter/X handle */
    twitter?: boolean | number
    /** Lens handle */
    lens?: boolean | number
    /** Farcaster handle */
    farcaster?: boolean | number
    /** Unix timestamp of when the profile was created */
    created?: boolean | number
    /** Total number of votes cast */
    votesCount?: boolean | number
    /** Total number of proposals created */
    proposalsCount?: boolean | number
    /** Unix timestamp of the user's most recent vote */
    lastVote?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A delegate statement */
export interface StatementGenqlSelection{
    /** Unique statement identifier */
    id?: boolean | number
    /** IPFS content identifier */
    ipfs?: boolean | number
    /** Space ID this statement belongs to */
    space?: boolean | number
    /** Network ID */
    network?: boolean | number
    /** Short bio of the delegate */
    about?: boolean | number
    /** Delegate address */
    delegate?: boolean | number
    /** Full delegate statement text */
    statement?: boolean | number
    /** Discourse forum username */
    discourse?: boolean | number
    /** Statement status */
    status?: boolean | number
    /** Source of the statement */
    source?: boolean | number
    /** Unix timestamp of when the statement was created */
    created?: boolean | number
    /** Unix timestamp of the last update */
    updated?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A reusable metadata item (skin, validation, plugin) */
export interface ItemGenqlSelection{
    /** Item identifier */
    id?: boolean | number
    /** Number of spaces using this item */
    spacesCount?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A voting strategy with full metadata */
export interface StrategyItemGenqlSelection{
    /** Strategy identifier */
    id?: boolean | number
    /** Display name */
    name?: boolean | number
    /** Strategy author */
    author?: boolean | number
    /** Strategy version */
    version?: boolean | number
    /** JSON schema for strategy parameters */
    schema?: boolean | number
    /** Example configurations */
    examples?: boolean | number
    /** Description of the strategy */
    about?: boolean | number
    /** Number of spaces using this strategy */
    spacesCount?: boolean | number
    /** Number of verified spaces using this strategy */
    verifiedSpacesCount?: boolean | number
    /** Whether voting power depend on other addresses or not */
    override?: boolean | number
    /** Whether the strategy is disabled */
    disabled?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A treasury managed by a space */
export interface TreasuryGenqlSelection{
    /** Treasury display name */
    name?: boolean | number
    /** Treasury wallet address */
    address?: boolean | number
    /** Network ID the treasury is on */
    network?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A label that can be applied to proposals */
export interface LabelGenqlSelection{
    /** Label identifier */
    id?: boolean | number
    /** Label display name */
    name?: boolean | number
    /** Label description */
    description?: boolean | number
    /** Hex color code */
    color?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Boost settings for a space */
export interface BoostSettingsGenqlSelection{
    /** Whether boosting is enabled */
    enabled?: boolean | number
    /** Whether bribe-based boosting is enabled */
    bribeEnabled?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Voting power information */
export interface VpGenqlSelection{
    /** Total voting power */
    vp?: boolean | number
    /** Voting power broken down by strategy */
    vp_by_strategy?: boolean | number
    /** Voting power state (e.g. final, pending) */
    vp_state?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Leaderboard entry for a user in a space */
export interface LeaderboardGenqlSelection{
    /** Space ID */
    space?: boolean | number
    /** User address */
    user?: boolean | number
    /** Number of proposals created */
    proposalsCount?: boolean | number
    /** Number of votes cast */
    votesCount?: boolean | number
    /** Unix timestamp of the user's most recent vote */
    lastVote?: boolean | number
    /** Monetary value of the user's voting power */
    vpValue?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A configuration option */
export interface OptionGenqlSelection{
    /** Option name */
    name?: boolean | number
    /** Option value */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Custom theme settings for a space skin */
export interface SkinSettingsGenqlSelection{
    /** Background color */
    bg_color?: boolean | number
    /** Link color */
    link_color?: boolean | number
    /** Text color */
    text_color?: boolean | number
    /** Content area color */
    content_color?: boolean | number
    /** Border color */
    border_color?: boolean | number
    /** Heading color */
    heading_color?: boolean | number
    /** Header color */
    header_color?: boolean | number
    /** Primary accent color */
    primary_color?: boolean | number
    /** Theme name (light or dark) */
    theme?: boolean | number
    /** Custom logo URL */
    logo?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A blockchain network */
export interface NetworkGenqlSelection{
    /** Network chain ID */
    id?: boolean | number
    /** Network display name */
    name?: boolean | number
    /** Whether this is a premium network */
    premium?: boolean | number
    /** Number of spaces using this network */
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
