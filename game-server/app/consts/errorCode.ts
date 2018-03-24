namespace ErrorCode {
  export const OK = { code: 200 }
  export const MATCH_READY_OK = { code: 201 }
  export const FAIL = { code: 500 }
  export const PARAMS_ERROR = { code: 501, msg: "参数错误!" }
  export const NOT_EXIST_CMD = { code: 502, msg: "不存在的命令" }
  export const NO_EXIST_USER = { code: 503, msg: "不存在的玩家" }
  export const PERMISSION_ERROR = { code: 504, msg: "此用户权限不足" }
  export const SYSTEM_ERROR = { code: 505, msg: "系统错误,请联系客服" }
  export const QUERY_NO_RESULT = { code: 506, msg: "没有查询结果" }
  export const NO_EXIST_SESSION = { code: 507, msg: '回话丢失, 请重新连接' }
}