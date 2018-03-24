"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diZhuButton = {
    "sendCard": {
        "state": "sendCard",
        "action": {
            "sendCard": "sendCard",
            "state": "sendCard",
        }
    },
    "pull": {
        "state": "pull",
        "action": {
            "pull": "pull",
            "notPull": "notPull",
            "state": "pull",
        }
    },
    "followDefault": {
        "state": "follow",
        "action": {
            "follow": "follow",
            "notFollow": "notFollow",
            "state": "follow",
        }
    },
    "kickDefault": {
        "state": "kick",
        "action": {
            "kick": "kick",
            "notKick": "notKick",
            "state": "kick",
        }
    },
    "addTimes": {
        "state": "addTimes",
        "action": {
            "addTimes": "addTimes",
            "notAddTimes": "notAddTimes",
            "state": "addTimes",
        }
    },
    "notSendCard": {
        "state": "notSendCard",
        "action": {
            "sendCard": "sendCard",
            "notSendCard": "notSendCard",
            "prompting": "prompting" //提示
        }
    },
    "grasp": {
        "state": "grasp",
        "action": {
            "grasp": "grasp",
            "lookCards": "lookCards",
            "isPz": true,
            "state": "grasp"
        }
    },
    "notGsp": {
        "state": "notGsp",
        "action": {
            "gsp": "grp",
            "notGsp": "notGsp",
            "state": "notGsp",
        }
    },
    "gsp": {
        "state": "gsp",
        "action": {
            "gsp": "gsp",
            "state": "gsp",
        }
    },
    "callPoints": {
        "state": "callPoints",
        "action": {
            "landOwer": [1, 2, 3],
            "notCall": "notCall",
            "state": "callPoints",
        },
    },
    "landOwner": {
        "state": "landOwner",
        "action": {
            "landOwner": "landOwner",
            "notCall": "notCall",
            "state": "landOwner",
        }
    }
};
