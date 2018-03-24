import * as md5 from 'md5';
import reply from '../const/reply';
const fs = require('fs')
const gm = require('gm').subClass({ imagemagick: true });
const QRCode = require('qrcode');

const ttc = `${process.cwd()}/source/card/MSYH.ttc`;
const cardDirPath = `${process.cwd()}/source/card/`;
const frinedTemplate = `${process.cwd()}/source/card/frinedTemplate.jpg`;
const curatorTemplate = `${process.cwd()}/source/card/curatorTemplate.jpg`;

export default class CardUtil {
    /**
     * 
     * @param user 
     * shortId:number,
     * wechat:      string,
     * phone:       string,
     * name:        string,
     * chessRoom:   string
     */
    public static async createFriendCard(user: any) {
        const disturb = 'friend';
        const md5id = md5(user.shortId + disturb);
        const cardPath = `${cardDirPath + md5id}card.png`;
        //生成二维码
        const qrcodePath = await this.qrCode(user.shortId, user.url, disturb);
        console.log('qrcodePath', qrcodePath);
        const num = 500 - (user.chessRoom.length * 30);
        return new Promise((resolve, reject) => {
            gm(frinedTemplate)
                .fill("#787979")
                .fontSize(31)
                .font(ttc, 28)
                .drawText(93, 255, user.phone)
                .drawText(93, 315, user.wechat)
                .font(ttc, 28)
                .fill("#fff")
                .drawText(560, 412, user.name)
                .font(ttc, 35)
                .fill("#fff")
                .drawText(num, 85, user.chessRoom)
                .write(cardPath, function (err, charge) {
                    if(err != null){
                        console.log('err=>',err);
                        reject(err)
                    }else{
                        resolve();
                    }
                });
        }).then(() => {
            const result: any = {
                'shortId': user.shortId,
                'cardPath': cardPath,
                'qrcodePath': qrcodePath,
                'disturb': disturb
            }
            return result;
        }).catch((err) => {
            return null;
        });
    }

    public static async createCuratorCard(user: any) {
        const disturb = 'curator';
        const md5id = md5(user.shortId + disturb);
        const cardPath = `${cardDirPath + md5id}card.png`;
        //生成二维码
        const qrcodePath = await this.qrCode(user.shortId, user.url, disturb);
        const num = 500 - (user.chessRoom.length * 30);
        return new Promise((resolve, reject) => {
            gm(curatorTemplate)
                .fill("#fff")
                .fontSize(31)
                .font(ttc, 28)
                .drawText(100, 413, user.phone)
                .drawText(93, 381, user.wechat)
                .font(ttc, 35)
                .fill("#fff")
                .drawText(num, 85, user.chessRoom)
                .write(cardPath, function (err, charge) {
                    if (err != null) {
                        console.log('err=>', err);
                        reject(err)
                    } else {
                        resolve();
                    }
                });
        }).then(() => {
            const result: any = {
                'shortId': user.shortId,
                'cardPath': cardPath,
                'qrcodePath': qrcodePath,
                'disturb': disturb
            }
            return result;
        }).catch((err) => {
            return null;
        });
    }

    //生成二维码
    private static async  qrCode(shortId: string, url: string, disturb: string = "friend") {
        const md5id = md5(shortId + disturb);
        const qrcodePath = `${process.cwd()}/source/card/${md5id}qrcode.png`;
        await new Promise((resolve, reject) => {
            QRCode.toFile(qrcodePath, url, {
                color: {
                    dark: '#000',
                    light: '#fff'
                }
            }, function (err) {
                reject(err);
            });
        }).then((charge) => {
            return charge;
        }).catch((err) => {
            return err;
        });
        return qrcodePath;
    }

    /**
     * 合并图片
     * @param card 
     * shortId:     string,
     * disturb:     string,
     * cardPath:    string,
     * qrcodePath:  string
     */
    public static async mergeImage(card: any) {
        const md5id = `${md5(card.shortId + card.disturb)}.png`;
        const mergePath = `${process.cwd()}/source/card/${md5id}`;
        return new Promise((resolve, reject) => {
            gm()
                .in('-page', '+0+0')
                .in(card.cardPath)
                .in('-page', '+95+30')
                .in(card.qrcodePath)
                .mosaic()
                .write(mergePath, function (err) {
                    console.log('merge err=>', err);
                    resolve(err)
                });
        }).then((data) => {
            const result: any = {
                'md5id': md5id,
                'mergePath': mergePath
            }
            return result;
        }).catch(() => {
            return null;
        })
    }


    public static async deleteFile(filePath: string) {
        fs.exists(filePath, exists => {
            if (exists) fs.unlinkSync(filePath);
        })
    }

}