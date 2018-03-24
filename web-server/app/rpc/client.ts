import { Service, Context } from 'egg'
import * as jayson from 'jayson/promise'

export default class RCPClient extends Service {
  private static client:any;

  public static init(app:any) {
    const rpcClient = app.config.rpcClient
    this.client = jayson.client.http({
      port: rpcClient.port,
      host: rpcClient.host
    });
  }
  
  public static async updateConfig() {
    console.log("web-server client updateConfig");
    const response = await this.client.request('updateConfig',[]);
    return response;
  }
  
  public static async updateBroadcast(){
    console.log("web-server client updatBroadcast");
    const response = await this.client.request('updateBroadcast',[]);
    return response;
  }

  public static async stopServer(){
    console.log("web-server client stopServer");
    const response = await this.client.request('stopServer',[]);
    return response;
  }

  public static async onUserPay(uid:string,card:string){
    console.log("web-server client onUserPay");
    const response = await this.client.request('onUserPay',[uid,card]);
    return response;
  }

  






}
