
export const diZhuButton = {
    "sendCard": {
        "state": "sendCard",
        "action":{
            "sendCard": "sendCard",   //出牌     
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
        "state": "addTimes",  //加倍
        "action": {
            "addTimes": "addTimes",
            "notAddTimes": "notAddTimes",  //不加倍
            "state": "addTimes",  //加倍
        }
    },
    "notSendCard": {
        "state": "notSendCard",  //不出
        "action": {
            "sendCard": "sendCard", //出牌
            "notSendCard": "notSendCard", //不出
            "prompting": "prompting" //提示
        }
    },
    "grasp": {
        "state": "grasp",
        "action": {
            "grasp": "grasp",  //闷抓
            "lookCards": "lookCards",  //看牌
            "isPz": true,
            "state":"grasp"
        }
    },
    "notGsp":{
        "state":"notGsp",
        "action":{
            "gsp":"grp",
            "notGsp":"notGsp",
            "state":"notGsp",
        }
    },
    "gsp":{
        "state":"gsp",
        "action":{
            "gsp":"gsp", //抓
            "state":"gsp",

        }
    },
    "callPoints":{
        "state": "callPoints",
        "action": {
            "landOwer": [1,2,3],
            "notCall": "notCall",
            "state": "callPoints",
        },
    },
    "landOwner":{
        "state": "landOwner",
        "action": {
            "landOwner": "landOwner",  //叫地主
            "notCall": "notCall",    //不叫地主
            "state": "landOwner",
        }
    }

}

