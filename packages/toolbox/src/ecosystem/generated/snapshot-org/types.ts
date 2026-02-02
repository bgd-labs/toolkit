export default {
    "scalars": [
        0,
        2,
        3,
        5,
        10,
        19
    ],
    "types": {
        "Any": {},
        "Query": {
            "space": [
                20,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "spaces": [
                20,
                {
                    "first": [
                        3,
                        "Int!"
                    ],
                    "skip": [
                        3,
                        "Int!"
                    ],
                    "where": [
                        4
                    ],
                    "orderBy": [
                        2
                    ],
                    "orderDirection": [
                        19
                    ]
                }
            ],
            "ranking": [
                21,
                {
                    "first": [
                        3,
                        "Int!"
                    ],
                    "skip": [
                        3,
                        "Int!"
                    ],
                    "where": [
                        6
                    ]
                }
            ],
            "proposal": [
                25,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "proposals": [
                25,
                {
                    "first": [
                        3,
                        "Int!"
                    ],
                    "skip": [
                        3,
                        "Int!"
                    ],
                    "where": [
                        9
                    ],
                    "orderBy": [
                        2
                    ],
                    "orderDirection": [
                        19
                    ]
                }
            ],
            "vote": [
                29,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "votes": [
                29,
                {
                    "first": [
                        3,
                        "Int!"
                    ],
                    "skip": [
                        3,
                        "Int!"
                    ],
                    "where": [
                        11
                    ],
                    "orderBy": [
                        2
                    ],
                    "orderDirection": [
                        19
                    ]
                }
            ],
            "aliases": [
                30,
                {
                    "first": [
                        3,
                        "Int!"
                    ],
                    "skip": [
                        3,
                        "Int!"
                    ],
                    "where": [
                        12
                    ],
                    "orderBy": [
                        2
                    ],
                    "orderDirection": [
                        19
                    ]
                }
            ],
            "roles": [
                31,
                {
                    "where": [
                        13,
                        "RolesWhere!"
                    ]
                }
            ],
            "follows": [
                32,
                {
                    "first": [
                        3,
                        "Int!"
                    ],
                    "skip": [
                        3,
                        "Int!"
                    ],
                    "where": [
                        14
                    ],
                    "orderBy": [
                        2
                    ],
                    "orderDirection": [
                        19
                    ]
                }
            ],
            "subscriptions": [
                33,
                {
                    "first": [
                        3,
                        "Int!"
                    ],
                    "skip": [
                        3,
                        "Int!"
                    ],
                    "where": [
                        15
                    ],
                    "orderBy": [
                        2
                    ],
                    "orderDirection": [
                        19
                    ]
                }
            ],
            "users": [
                34,
                {
                    "first": [
                        3,
                        "Int!"
                    ],
                    "skip": [
                        3,
                        "Int!"
                    ],
                    "where": [
                        16
                    ],
                    "orderBy": [
                        2
                    ],
                    "orderDirection": [
                        19
                    ]
                }
            ],
            "statements": [
                35,
                {
                    "first": [
                        3,
                        "Int!"
                    ],
                    "skip": [
                        3,
                        "Int!"
                    ],
                    "where": [
                        17
                    ],
                    "orderBy": [
                        2
                    ],
                    "orderDirection": [
                        19
                    ]
                }
            ],
            "user": [
                34,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "statement": [
                35,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "skins": [
                36
            ],
            "networks": [
                45
            ],
            "validations": [
                36
            ],
            "plugins": [
                36
            ],
            "strategies": [
                37
            ],
            "strategy": [
                37,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "vp": [
                41,
                {
                    "voter": [
                        2,
                        "String!"
                    ],
                    "space": [
                        2,
                        "String!"
                    ],
                    "proposal": [
                        2
                    ]
                }
            ],
            "messages": [
                8,
                {
                    "first": [
                        3,
                        "Int!"
                    ],
                    "skip": [
                        3,
                        "Int!"
                    ],
                    "where": [
                        7
                    ],
                    "orderBy": [
                        2
                    ],
                    "orderDirection": [
                        19
                    ]
                }
            ],
            "leaderboards": [
                42,
                {
                    "first": [
                        3,
                        "Int!"
                    ],
                    "skip": [
                        3,
                        "Int!"
                    ],
                    "where": [
                        18
                    ],
                    "orderBy": [
                        2
                    ],
                    "orderDirection": [
                        19
                    ]
                }
            ],
            "options": [
                43
            ],
            "__typename": [
                2
            ]
        },
        "String": {},
        "Int": {},
        "SpaceWhere": {
            "id": [
                2
            ],
            "id_in": [
                2
            ],
            "created": [
                3
            ],
            "created_in": [
                3
            ],
            "created_gt": [
                3
            ],
            "created_gte": [
                3
            ],
            "created_lt": [
                3
            ],
            "created_lte": [
                3
            ],
            "strategy": [
                2
            ],
            "plugin": [
                2
            ],
            "controller": [
                2
            ],
            "verified": [
                5
            ],
            "domain": [
                2
            ],
            "search": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Boolean": {},
        "RankingWhere": {
            "search": [
                2
            ],
            "category": [
                2
            ],
            "network": [
                2
            ],
            "strategy": [
                2
            ],
            "plugin": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "MessageWhere": {
            "id": [
                2
            ],
            "id_in": [
                2
            ],
            "mci": [
                3
            ],
            "mci_in": [
                3
            ],
            "mci_gt": [
                3
            ],
            "mci_gte": [
                3
            ],
            "mci_lt": [
                3
            ],
            "mci_lte": [
                3
            ],
            "address": [
                2
            ],
            "address_in": [
                2
            ],
            "timestamp": [
                3
            ],
            "timestamp_in": [
                3
            ],
            "timestamp_gt": [
                3
            ],
            "timestamp_gte": [
                3
            ],
            "timestamp_lt": [
                3
            ],
            "timestamp_lte": [
                3
            ],
            "space": [
                2
            ],
            "space_in": [
                2
            ],
            "type": [
                2
            ],
            "type_in": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Message": {
            "mci": [
                3
            ],
            "id": [
                2
            ],
            "ipfs": [
                2
            ],
            "address": [
                2
            ],
            "version": [
                2
            ],
            "timestamp": [
                3
            ],
            "space": [
                2
            ],
            "type": [
                2
            ],
            "sig": [
                2
            ],
            "receipt": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "ProposalWhere": {
            "id": [
                2
            ],
            "id_in": [
                2
            ],
            "ipfs": [
                2
            ],
            "ipfs_in": [
                2
            ],
            "space": [
                2
            ],
            "space_in": [
                2
            ],
            "author": [
                2
            ],
            "author_in": [
                2
            ],
            "network": [
                2
            ],
            "network_in": [
                2
            ],
            "title_contains": [
                2
            ],
            "strategies_contains": [
                2
            ],
            "plugins_contains": [
                2
            ],
            "validation": [
                2
            ],
            "type": [
                2
            ],
            "type_in": [
                2
            ],
            "app": [
                2
            ],
            "app_not": [
                2
            ],
            "app_in": [
                2
            ],
            "app_not_in": [
                2
            ],
            "created": [
                3
            ],
            "created_in": [
                3
            ],
            "created_gt": [
                3
            ],
            "created_gte": [
                3
            ],
            "created_lt": [
                3
            ],
            "created_lte": [
                3
            ],
            "updated": [
                3
            ],
            "updated_in": [
                3
            ],
            "updated_gt": [
                3
            ],
            "updated_gte": [
                3
            ],
            "updated_lt": [
                3
            ],
            "updated_lte": [
                3
            ],
            "start": [
                3
            ],
            "start_in": [
                3
            ],
            "start_gt": [
                3
            ],
            "start_gte": [
                3
            ],
            "start_lt": [
                3
            ],
            "start_lte": [
                3
            ],
            "end": [
                3
            ],
            "end_in": [
                3
            ],
            "end_gt": [
                3
            ],
            "end_gte": [
                3
            ],
            "end_lt": [
                3
            ],
            "end_lte": [
                3
            ],
            "scores_state": [
                2
            ],
            "scores_state_in": [
                2
            ],
            "labels_in": [
                2
            ],
            "state": [
                2
            ],
            "space_verified": [
                5
            ],
            "flagged": [
                5
            ],
            "votes": [
                3
            ],
            "votes_gt": [
                3
            ],
            "votes_gte": [
                3
            ],
            "votes_lt": [
                3
            ],
            "votes_lte": [
                3
            ],
            "scores_total_value": [
                10
            ],
            "scores_total_value_in": [
                10
            ],
            "scores_total_value_gt": [
                10
            ],
            "scores_total_value_gte": [
                10
            ],
            "scores_total_value_lt": [
                10
            ],
            "scores_total_value_lte": [
                10
            ],
            "__typename": [
                2
            ]
        },
        "Float": {},
        "VoteWhere": {
            "id": [
                2
            ],
            "id_in": [
                2
            ],
            "ipfs": [
                2
            ],
            "ipfs_in": [
                2
            ],
            "space": [
                2
            ],
            "space_in": [
                2
            ],
            "voter": [
                2
            ],
            "voter_in": [
                2
            ],
            "proposal": [
                2
            ],
            "proposal_in": [
                2
            ],
            "reason": [
                2
            ],
            "reason_not": [
                2
            ],
            "reason_in": [
                2
            ],
            "reason_not_in": [
                2
            ],
            "app": [
                2
            ],
            "app_not": [
                2
            ],
            "app_in": [
                2
            ],
            "app_not_in": [
                2
            ],
            "created": [
                3
            ],
            "created_in": [
                3
            ],
            "created_gt": [
                3
            ],
            "created_gte": [
                3
            ],
            "created_lt": [
                3
            ],
            "created_lte": [
                3
            ],
            "vp": [
                10
            ],
            "vp_in": [
                10
            ],
            "vp_gt": [
                10
            ],
            "vp_gte": [
                10
            ],
            "vp_lt": [
                10
            ],
            "vp_lte": [
                10
            ],
            "vp_state": [
                2
            ],
            "vp_state_in": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "AliasWhere": {
            "id": [
                2
            ],
            "id_in": [
                2
            ],
            "ipfs": [
                2
            ],
            "ipfs_in": [
                2
            ],
            "address": [
                2
            ],
            "address_in": [
                2
            ],
            "alias": [
                2
            ],
            "alias_in": [
                2
            ],
            "created": [
                3
            ],
            "created_in": [
                3
            ],
            "created_gt": [
                3
            ],
            "created_gte": [
                3
            ],
            "created_lt": [
                3
            ],
            "created_lte": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "RolesWhere": {
            "address": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "FollowWhere": {
            "id": [
                2
            ],
            "id_in": [
                2
            ],
            "ipfs": [
                2
            ],
            "ipfs_in": [
                2
            ],
            "follower": [
                2
            ],
            "follower_in": [
                2
            ],
            "space": [
                2
            ],
            "space_in": [
                2
            ],
            "network": [
                2
            ],
            "network_in": [
                2
            ],
            "created": [
                3
            ],
            "created_in": [
                3
            ],
            "created_gt": [
                3
            ],
            "created_gte": [
                3
            ],
            "created_lt": [
                3
            ],
            "created_lte": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "SubscriptionWhere": {
            "id": [
                2
            ],
            "id_in": [
                2
            ],
            "ipfs": [
                2
            ],
            "ipfs_in": [
                2
            ],
            "address": [
                2
            ],
            "address_in": [
                2
            ],
            "space": [
                2
            ],
            "space_in": [
                2
            ],
            "created": [
                3
            ],
            "created_in": [
                3
            ],
            "created_gt": [
                3
            ],
            "created_gte": [
                3
            ],
            "created_lt": [
                3
            ],
            "created_lte": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "UsersWhere": {
            "id": [
                2
            ],
            "id_in": [
                2
            ],
            "ipfs": [
                2
            ],
            "ipfs_in": [
                2
            ],
            "created": [
                3
            ],
            "created_in": [
                3
            ],
            "created_gt": [
                3
            ],
            "created_gte": [
                3
            ],
            "created_lt": [
                3
            ],
            "created_lte": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "StatementsWhere": {
            "id": [
                2
            ],
            "id_in": [
                2
            ],
            "ipfs": [
                2
            ],
            "ipfs_in": [
                2
            ],
            "space": [
                2
            ],
            "space_in": [
                2
            ],
            "network": [
                2
            ],
            "delegate": [
                2
            ],
            "delegate_in": [
                2
            ],
            "created": [
                3
            ],
            "created_in": [
                3
            ],
            "created_gt": [
                3
            ],
            "created_gte": [
                3
            ],
            "created_lt": [
                3
            ],
            "created_lte": [
                3
            ],
            "source": [
                2
            ],
            "source_in": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "LeaderboardsWhere": {
            "space": [
                2
            ],
            "space_in": [
                2
            ],
            "space_not": [
                2
            ],
            "space_not_in": [
                2
            ],
            "user": [
                2
            ],
            "user_in": [
                2
            ],
            "user_not": [
                2
            ],
            "user_not_in": [
                2
            ],
            "proposal_count": [
                3
            ],
            "proposal_count_in": [
                3
            ],
            "proposal_count_not": [
                3
            ],
            "proposal_count_not_in": [
                3
            ],
            "proposal_count_gt": [
                3
            ],
            "proposal_count_gte": [
                3
            ],
            "proposal_count_lt": [
                3
            ],
            "proposal_count_lte": [
                3
            ],
            "vote_count": [
                3
            ],
            "vote_count_in": [
                3
            ],
            "vote_count_not": [
                3
            ],
            "vote_count_not_in": [
                3
            ],
            "vote_count_gt": [
                3
            ],
            "vote_count_gte": [
                3
            ],
            "vote_count_lt": [
                3
            ],
            "vote_count_lte": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "OrderDirection": {},
        "Space": {
            "id": [
                2
            ],
            "name": [
                2
            ],
            "private": [
                5
            ],
            "about": [
                2
            ],
            "avatar": [
                2
            ],
            "cover": [
                2
            ],
            "terms": [
                2
            ],
            "location": [
                2
            ],
            "website": [
                2
            ],
            "twitter": [
                2
            ],
            "github": [
                2
            ],
            "farcaster": [
                2
            ],
            "coingecko": [
                2
            ],
            "email": [
                2
            ],
            "discussions": [
                2
            ],
            "discourseCategory": [
                3
            ],
            "network": [
                2
            ],
            "symbol": [
                2
            ],
            "skin": [
                2
            ],
            "skinSettings": [
                44
            ],
            "domain": [
                2
            ],
            "strategies": [
                26
            ],
            "admins": [
                2
            ],
            "members": [
                2
            ],
            "moderators": [
                2
            ],
            "filters": [
                23
            ],
            "plugins": [
                0
            ],
            "voting": [
                24
            ],
            "categories": [
                2
            ],
            "validation": [
                27
            ],
            "voteValidation": [
                27
            ],
            "delegationPortal": [
                28
            ],
            "treasuries": [
                38
            ],
            "labels": [
                39
            ],
            "activeProposals": [
                3
            ],
            "proposalsCount": [
                3
            ],
            "proposalsCount1d": [
                3
            ],
            "proposalsCount7d": [
                3
            ],
            "proposalsCount30d": [
                3
            ],
            "followersCount": [
                3
            ],
            "followersCount7d": [
                3
            ],
            "votesCount": [
                3
            ],
            "votesCount7d": [
                3
            ],
            "parent": [
                20
            ],
            "children": [
                20
            ],
            "guidelines": [
                2
            ],
            "template": [
                2
            ],
            "verified": [
                5
            ],
            "flagged": [
                5
            ],
            "flagCode": [
                3
            ],
            "hibernated": [
                5
            ],
            "turbo": [
                5
            ],
            "turboExpiration": [
                3
            ],
            "rank": [
                10
            ],
            "boost": [
                40
            ],
            "created": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "RankingObject": {
            "items": [
                20
            ],
            "metrics": [
                22
            ],
            "__typename": [
                2
            ]
        },
        "Metrics": {
            "total": [
                3
            ],
            "categories": [
                0
            ],
            "__typename": [
                2
            ]
        },
        "SpaceFilters": {
            "minScore": [
                10
            ],
            "onlyMembers": [
                5
            ],
            "__typename": [
                2
            ]
        },
        "SpaceVoting": {
            "delay": [
                3
            ],
            "period": [
                3
            ],
            "type": [
                2
            ],
            "quorum": [
                10
            ],
            "quorumType": [
                2
            ],
            "blind": [
                5
            ],
            "hideAbstain": [
                5
            ],
            "privacy": [
                2
            ],
            "aliased": [
                5
            ],
            "__typename": [
                2
            ]
        },
        "Proposal": {
            "id": [
                2
            ],
            "ipfs": [
                2
            ],
            "author": [
                2
            ],
            "created": [
                3
            ],
            "updated": [
                3
            ],
            "space": [
                20
            ],
            "network": [
                2
            ],
            "symbol": [
                2
            ],
            "type": [
                2
            ],
            "strategies": [
                26
            ],
            "validation": [
                27
            ],
            "plugins": [
                0
            ],
            "title": [
                2
            ],
            "body": [
                2
            ],
            "discussion": [
                2
            ],
            "choices": [
                2
            ],
            "labels": [
                2
            ],
            "start": [
                3
            ],
            "end": [
                3
            ],
            "quorum": [
                10
            ],
            "quorumType": [
                2
            ],
            "privacy": [
                2
            ],
            "snapshot": [
                3
            ],
            "state": [
                2
            ],
            "link": [
                2
            ],
            "app": [
                2
            ],
            "scores": [
                10
            ],
            "scores_by_strategy": [
                0
            ],
            "scores_state": [
                2
            ],
            "scores_total": [
                10
            ],
            "scores_updated": [
                3
            ],
            "scores_total_value": [
                10
            ],
            "vp_value_by_strategy": [
                0
            ],
            "votes": [
                3
            ],
            "flagged": [
                5
            ],
            "flagCode": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "Strategy": {
            "name": [
                2
            ],
            "network": [
                2
            ],
            "params": [
                0
            ],
            "__typename": [
                2
            ]
        },
        "Validation": {
            "name": [
                2
            ],
            "params": [
                0
            ],
            "__typename": [
                2
            ]
        },
        "DelegationPortal": {
            "delegationType": [
                2
            ],
            "delegationContract": [
                2
            ],
            "delegationNetwork": [
                2
            ],
            "delegationApi": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Vote": {
            "id": [
                2
            ],
            "ipfs": [
                2
            ],
            "voter": [
                2
            ],
            "created": [
                3
            ],
            "space": [
                20
            ],
            "proposal": [
                25
            ],
            "choice": [
                0
            ],
            "metadata": [
                0
            ],
            "reason": [
                2
            ],
            "app": [
                2
            ],
            "vp": [
                10
            ],
            "vp_by_strategy": [
                10
            ],
            "vp_state": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Alias": {
            "id": [
                2
            ],
            "ipfs": [
                2
            ],
            "address": [
                2
            ],
            "alias": [
                2
            ],
            "created": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "Role": {
            "space": [
                2
            ],
            "permissions": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Follow": {
            "id": [
                2
            ],
            "ipfs": [
                2
            ],
            "follower": [
                2
            ],
            "space": [
                20
            ],
            "network": [
                2
            ],
            "created": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "Subscription": {
            "id": [
                2
            ],
            "ipfs": [
                2
            ],
            "address": [
                2
            ],
            "space": [
                20
            ],
            "created": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "User": {
            "id": [
                2
            ],
            "ipfs": [
                2
            ],
            "name": [
                2
            ],
            "about": [
                2
            ],
            "avatar": [
                2
            ],
            "cover": [
                2
            ],
            "github": [
                2
            ],
            "twitter": [
                2
            ],
            "lens": [
                2
            ],
            "farcaster": [
                2
            ],
            "created": [
                3
            ],
            "votesCount": [
                3
            ],
            "proposalsCount": [
                3
            ],
            "lastVote": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "Statement": {
            "id": [
                2
            ],
            "ipfs": [
                2
            ],
            "space": [
                2
            ],
            "network": [
                2
            ],
            "about": [
                2
            ],
            "delegate": [
                2
            ],
            "statement": [
                2
            ],
            "discourse": [
                2
            ],
            "status": [
                2
            ],
            "source": [
                2
            ],
            "created": [
                3
            ],
            "updated": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "Item": {
            "id": [
                2
            ],
            "spacesCount": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "StrategyItem": {
            "id": [
                2
            ],
            "name": [
                2
            ],
            "author": [
                2
            ],
            "version": [
                2
            ],
            "schema": [
                0
            ],
            "examples": [
                0
            ],
            "about": [
                2
            ],
            "spacesCount": [
                3
            ],
            "verifiedSpacesCount": [
                3
            ],
            "override": [
                5
            ],
            "disabled": [
                5
            ],
            "__typename": [
                2
            ]
        },
        "Treasury": {
            "name": [
                2
            ],
            "address": [
                2
            ],
            "network": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Label": {
            "id": [
                2
            ],
            "name": [
                2
            ],
            "description": [
                2
            ],
            "color": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "BoostSettings": {
            "enabled": [
                5
            ],
            "bribeEnabled": [
                5
            ],
            "__typename": [
                2
            ]
        },
        "Vp": {
            "vp": [
                10
            ],
            "vp_by_strategy": [
                10
            ],
            "vp_state": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Leaderboard": {
            "space": [
                2
            ],
            "user": [
                2
            ],
            "proposalsCount": [
                3
            ],
            "votesCount": [
                3
            ],
            "lastVote": [
                3
            ],
            "__typename": [
                2
            ]
        },
        "Option": {
            "name": [
                2
            ],
            "value": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "SkinSettings": {
            "bg_color": [
                2
            ],
            "link_color": [
                2
            ],
            "text_color": [
                2
            ],
            "content_color": [
                2
            ],
            "border_color": [
                2
            ],
            "heading_color": [
                2
            ],
            "header_color": [
                2
            ],
            "primary_color": [
                2
            ],
            "theme": [
                2
            ],
            "logo": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Network": {
            "id": [
                2
            ],
            "name": [
                2
            ],
            "premium": [
                5
            ],
            "spacesCount": [
                3
            ],
            "__typename": [
                2
            ]
        }
    }
}