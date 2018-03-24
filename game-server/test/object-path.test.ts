var obj = {
  "triggers": {
    "input": {
      "hookExpr": "",
      "scope": "all",
      "actions": [[],["zhang", "chi", "peng", "bugang", "hu"], ["peng", "bugang", "hu"], ["peng", "bugang", "hu"]]
    },
    "output": {
      "scope": "self",
      "actions": [["angang", "bugang", "hu"]],
      "nextTrigger": "qiangganghu"
    },
    "ganghu": {
      "hookExpr": "isGang",
      "scope": "others",
      "actions": [["hu"], ["hu"], ["hu"]]
    } 
  }
};

import * as objectPath from 'object-path'
console.log(obj.triggers.input.actions)
objectPath.del(obj, 'triggers.input.actions.1.0');

console.log(obj.triggers.input.actions)