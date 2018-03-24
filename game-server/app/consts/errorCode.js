var ErrorCode;
(function (ErrorCode) {
    ErrorCode.OK = { code: 200 };
    ErrorCode.MATCH_READY_OK = { code: 201 };
    ErrorCode.FAIL = { code: 500 };
    ErrorCode.PARAMS_ERROR = { code: 501, msg: "参数错误!" };
    ErrorCode.NOT_EXIST_CMD = { code: 502, msg: "不存在的命令" };
    ErrorCode.NO_EXIST_USER = { code: 503, msg: "不存在的玩家" };
    ErrorCode.PERMISSION_ERROR = { code: 504, msg: "此用户权限不足" };
    ErrorCode.SYSTEM_ERROR = { code: 505, msg: "系统错误,请联系客服" };
    ErrorCode.QUERY_NO_RESULT = { code: 506, msg: "没有查询结果" };
    ErrorCode.NO_EXIST_SESSION = { code: 507, msg: '回话丢失, 请重新连接' };
})(ErrorCode || (ErrorCode = {}));
