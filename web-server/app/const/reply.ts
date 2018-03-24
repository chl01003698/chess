'use strict';

const code={
    FAILED:-1,
    SUCCESS:0
}

export default {
    code:code,

    success:function(data:any){
        return {code:0,msg:'ok',data:data};
    },

    err:function(msg:string){
        return {code:-1,msg:msg};
    }
}