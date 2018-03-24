import { MJFormulaManage } from '../../components/MJFormulaManage';
import { ShowItem, ScoreData, ScoreDataBase } from '../../MJModel/MJFormulaModel'
import MJGamePlayer from '../../MJGamePlayer';
import { MJScoreManage } from '../../components/MJScoreManage'
import MJNCGamePlayer from './MJNCGamePlayer';
import * as _ from 'lodash'

export default class MJFormula {
    static getConfigScore(name, game, mjscoreManage, index) {
        return ScoreDataBase.getComboScoreByName(name, game, mjscoreManage, index);
    }
    static getPiaoScore(game, winIndex, loseIndex) {
        if (winIndex > 0 && loseIndex > 0 && game.gamePlayers[winIndex].piao > 0 && game.gamePlayers[loseIndex].piao > 0) {
            return game.gamePlayers[winIndex].piao + game.gamePlayers[loseIndex].piao
        }
        return 0;
    }
	
	static getScoreV2(params){
		// 飘分=赢家飘分+输家飘分
		// 输家失分=牌型分+牌型分+特殊分项+特殊分项+飘分+杠分		
		let { game, mjscoreManage, gamePlayers } = params
		let scoreInfo = {}
		_.forEach(gamePlayers, (v)=>{
			scoreInfo[v.uid] = new ScoreData()
		})

		// 计算所有事件，如杠上花，杠上炮，点杠杠开，抢杠胡等
		//let events = game.mjeventManage.calcEvents({game, mjscoreManage})
		let anGangInfo = mjscoreManage.filterScoreByType("angang")
		let buGangInfo = mjscoreManage.filterScoreByType("bugang")
		let dianGangInfo = mjscoreManage.filterScoreByType("diangang")				
		let huInfo = mjscoreManage.filterScoreByType("hu")
		_.forEach(huInfo, (v)=>{
			let gp = game.findPlayerByUid(v.uid)
			let combo = game.container.mjcomboManage.calcCombo(gp)
			this.comboMutex(combo)
			v.combo = combo
		})

		// 有人胡
		if(huInfo.length > 0){
			// 杠随胡走
			// 结算杠分
			this.balanceGang(gamePlayers, scoreInfo, anGangInfo, buGangInfo, dianGangInfo)
			// 自摸收三家
			if(huInfo[0].uid == huInfo[0].triggerUid){
				// 牌型分
				let curCombo = huInfo[0].combo
				let paiTypes = ["pinghu", "duiduihu", "qingyise", "qidui"]
				let paiScore = _.reduce(paiTypes, (sum, v)=>{ return sum += (curCombo[v].result>0? curCombo[v].result*curCombo[v].score: 0) }, 0)
				// 特殊分项
				let speTypes1 = ["yibangao", "queyimen", "menqing", "kaxinwu", "jingoudiao", "jingoupao"]
				let speScore1 = _.reduce(speTypes1, (sum, v)=>{ return sum += (curCombo[v].result>0? curCombo[v].result*curCombo[v].score: 0) }, 0)
				
				//let speTypes2 = ["gangshangkaihua", "ganghoupao", "qiangganghu", "saodihu", "haidipao"]
				//let speScore2 = _.reduce(speTypes2, (sum, v)=>{ return sum += (events[v].result? events[v].score: 0) }, 0)

				// TODO: 漂分，摆牌分
				let totalScore = paiScore + speScore1// + speScore2
				let uid = huInfo[0].uid
				_.forEach(gamePlayers, (p)=>{
					if(p.uid == uid){
						scoreInfo[uid].score += totalScore*gamePlayers.length
					}
					else{
						scoreInfo[p.uid].score -= totalScore
					}
				})
			}
			// 点炮
			else{
				_.forEach(huInfo, (h)=>{
					// 牌型分
					let curCombo = h.combo
					let paiTypes = ["pinghu", "duiduihu", "qingyise", "qidui"]
					let paiScore = _.reduce(paiTypes, (sum, v)=>{ return sum += (curCombo[v].result>0? curCombo[v].result*curCombo[v].score: 0) }, 0)
					// 特殊分项
					let speTypes1 = ["yibangao", "queyimen", "menqing", "kaxinwu", "jingoudiao", "jingoupao"]
					let speScore1 = _.reduce(speTypes1, (sum, v)=>{ return sum += (curCombo[v].result>0? curCombo[v].result*curCombo[v].score: 0) }, 0)
					
					//let speTypes2 = ["gangshangkaihua", "ganghoupao", "qiangganghu", "saodihu", "haidipao"]
					//let speScore2 = _.reduce(speTypes2, (sum, v)=>{ return sum += (events[v].result? events[v].score: 0) }, 0)

					// TODO: 漂分，摆牌分
					let totalScore = paiScore + speScore1// + speScore2

					scoreInfo[h.uid].score += totalScore
					scoreInfo[h.triggerUid].score -= totalScore
				})
			}
		}
		// 流局，查大叫
		else{
			
		}
		
		return scoreInfo
	}

	static balanceGang(gamePlayers, scoreInfo, anGangInfo, buGangInfo, dianGangInfo){
		// TODO: 优化代码
		// 暗杠收三家
		_.forEach(anGangInfo, (v)=>{
			let uid = v.uid			
			_.forEach(gamePlayers, (p)=>{
				if(p.uid == uid){
					scoreInfo[uid].score += (v.data.score*gamePlayers.length)
				}
				else{
					scoreInfo[p.uid].score -= v.data.score
				}
			})
		})
		// 补杠收三家
		_.forEach(buGangInfo, (v)=>{
			let uid = v.uid			
			_.forEach(gamePlayers, (p)=>{
				if(p.uid == uid){
					scoreInfo[uid].score += (v.data.score*gamePlayers.length)
				}
				else{
					scoreInfo[p.uid].score -= v.data.score
				}
			})
		})
		// 点杠收三家
		_.forEach(dianGangInfo, (v)=>{
			let uid = v.uid			
			_.forEach(gamePlayers, (p)=>{
				if(p.uid == uid){
					scoreInfo[uid].score += (v.data.score*gamePlayers.length)
				}
				else{
					scoreInfo[p.uid].score -= v.data.score
				}
			})				
		})
	}
	static comboMutex(combo){
		// 牌型互斥
		let pinghu = combo["pinghu"]
        let pengpenghu = combo["duiduihu"]
        let qingyise = combo["qingyise"]
        let qidui = combo["qidui"]
		if(pengpenghu.result > 0 || qingyise.result > 0 || qidui.result > 0){
			pinghu.score = 0
			pinghu.result = 0
		}

		let menqing = combo["menqing"]
		// 门清与七对不累加
		if(qidui.result > 0){
			menqing.score = 0
			menqing.result = 0
		}
	}
	
    static getScore(params): ScoreData {
        let { game, mjscoreManage, gamePlayer } = params;
        let player: MJNCGamePlayer = gamePlayer as MJNCGamePlayer;
        //赢家
        let winindex1, winindex2, winindex3;
        [winindex1, winindex2, winindex3] = ScoreDataBase.getWinners(game);

        console.log("赢家" + winindex1 + "    " + winindex2 + "    " + winindex3)
        //输家
        let loseindex1, loseindex2, loseindex3;
        [loseindex1, loseindex2, loseindex3] = ScoreDataBase.getloses(game);
        console.log("输家" + loseindex1 + "    " + loseindex2 + "    " + loseindex3)

        let winnerCount: number = ScoreDataBase.getValidCount([winindex1, winindex2, winindex3]);
        let lostCount: number = ScoreDataBase.getValidCount([loseindex1, loseindex2, loseindex3]);

        console.log("赢家[%d]   输家[%d]", winnerCount, lostCount)
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$++++++++++++++++++++  mjscoreManage")
        console.log(mjscoreManage.scores)
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$++++++++++++++++++++  mjscoreManage")
        for (let score of mjscoreManage.scores) {
            console.log(score.scoreData)
        }
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$++++++++++++++++++++  mjscoreManage")

        if (player.index == winindex1 || player.index == winindex2 || player.index == winindex3) {
            let scoreNum = 0;

            scoreNum += ScoreDataBase.getGang(game, mjscoreManage, player.index) * lostCount;

            scoreNum += this.getConfigScore("pinghu", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("duiduihu", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("qingyise", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("qidui", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("yibangao", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("queyimen", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("jingoudiao", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("jingoupao", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("kaxinwu", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("gangshanghua", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("ganghoupao", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("qiangganghu", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("saodihu", game, mjscoreManage, player.index) * lostCount;
            scoreNum += this.getConfigScore("haidipao", game, mjscoreManage, player.index) * lostCount;
            if (!this.getConfigScore("qidui", game, mjscoreManage, player.index)) {
                scoreNum += this.getConfigScore("menqing", game, mjscoreManage, player.index) * lostCount;
            }

            if (this.getConfigScore("baiduzhang", game, mjscoreManage, player.index)) {
                scoreNum += this.getConfigScore("baiduzhang", game, mjscoreManage, player.index) * lostCount;
            }
            else {
                scoreNum += this.getConfigScore("baipai", game, mjscoreManage, player.index) * lostCount;
            }

            scoreNum += this.getPiaoScore(game, player.index, loseindex1);
            scoreNum += this.getPiaoScore(game, player.index, loseindex2);
            scoreNum += this.getPiaoScore(game, player.index, loseindex3);

            let clientShowList = new Array(4);
            clientShowList = ScoreDataBase.initList(clientShowList, player.index);
            if (ScoreDataBase.getQingYiSe(game, mjscoreManage, player.index) > 0) {
                ScoreDataBase.addShowItem(clientShowList[0], player.index, 30086);
            }
            if (ScoreDataBase.getQingYiSe(game, mjscoreManage, player.index) > 0) {
                ScoreDataBase.addShowItem(clientShowList[0], player.index, 30038);
            }

            let info: ScoreData = new ScoreData;
            info.score = scoreNum;
            info.clientShowList = clientShowList;
            console.log(">>赢家得分[%d]", info.score);
            return info;
        }



        if (player.index == loseindex1 || player.index == loseindex2 || player.index == loseindex3) {

            let scoreNum = 0;

            scoreNum += this.getConfigScore("pinghu", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("duiduihu", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("qingyise", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("qidui", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("yibangao", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("queyimen", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("jingoudiao", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("jingoupao", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("kaxinwu", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("gangshanghua", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("ganghoupao", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("qiangganghu", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("saodihu", game, mjscoreManage, winindex1);
            scoreNum += this.getConfigScore("haidipao", game, mjscoreManage, winindex1);
            if (!this.getConfigScore("qidui", game, mjscoreManage, winindex1)) {
                scoreNum += this.getConfigScore("menqing", game, mjscoreManage, winindex1);
            }
            if (this.getConfigScore("baiduzhang", game, mjscoreManage, winindex1)) {
                scoreNum += this.getConfigScore("baiduzhang", game, mjscoreManage, winindex1);
            }
            else {
                scoreNum += this.getConfigScore("baipai", game, mjscoreManage, winindex1);
            }

            scoreNum += this.getConfigScore("pinghu", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("duiduihu", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("qingyise", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("qidui", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("yibangao", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("queyimen", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("jingoudiao", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("jingoupao", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("kaxinwu", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("gangshanghua", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("ganghoupao", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("qiangganghu", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("saodihu", game, mjscoreManage, winindex2);
            scoreNum += this.getConfigScore("haidipao", game, mjscoreManage, winindex2);
            if (!this.getConfigScore("qidui", game, mjscoreManage, winindex2)) {
                scoreNum += this.getConfigScore("menqing", game, mjscoreManage, winindex2);
            }
            if (this.getConfigScore("baiduzhang", game, mjscoreManage, winindex2)) {
                scoreNum += this.getConfigScore("baiduzhang", game, mjscoreManage, winindex2);
            }
            else {
                scoreNum += this.getConfigScore("baipai", game, mjscoreManage, winindex2);
            }

            scoreNum += this.getConfigScore("pinghu", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("duiduihu", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("qingyise", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("qidui", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("yibangao", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("queyimen", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("jingoudiao", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("jingoupao", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("kaxinwu", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("gangshanghua", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("ganghoupao", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("qiangganghu", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("saodihu", game, mjscoreManage, winindex3);
            scoreNum += this.getConfigScore("haidipao", game, mjscoreManage, winindex3);
            if (!this.getConfigScore("qidui", game, mjscoreManage, winindex3)) {
                scoreNum += this.getConfigScore("menqing", game, mjscoreManage, winindex3);
            }

            if (this.getConfigScore("baiduzhang", game, mjscoreManage, winindex3)) {
                scoreNum += this.getConfigScore("baiduzhang", game, mjscoreManage, winindex3);
            }
            else {
                scoreNum += this.getConfigScore("baipai", game, mjscoreManage, winindex3);
            }

            scoreNum += this.getPiaoScore(game, player.index, loseindex1);
            scoreNum += this.getPiaoScore(game, player.index, loseindex2);
            scoreNum += this.getPiaoScore(game, player.index, loseindex3);

            let clientShowList = new Array(4);
            clientShowList = ScoreDataBase.initList(clientShowList, winindex1, winindex2, winindex3);
            if (ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex1) > 0) {
                ScoreDataBase.addShowItem(clientShowList[0], winindex1, 30086);
            }
            if (ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex1) > 0) {
                ScoreDataBase.addShowItem(clientShowList[0], winindex1, 30038);
            }



            if (ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex2) > 0) {
                ScoreDataBase.addShowItem(clientShowList[1], winindex2, 30086);
            }
            if (ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex2) > 0) {
                ScoreDataBase.addShowItem(clientShowList[1], winindex2, 30038);
            }


            if (ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex3) > 0) {
                ScoreDataBase.addShowItem(clientShowList[2], winindex3, 30086);
            }
            if (ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex3) > 0) {
                ScoreDataBase.addShowItem(clientShowList[2], winindex3, 30038);
            }
            let info: ScoreData = new ScoreData();
            info.score = -scoreNum;
            info.clientShowList = clientShowList;
            return info;
        }

        let info: ScoreData = new ScoreData();
        info.score = 0;
        return info;
    }

    // 获取该玩家能得多少分，如果胡的话
    // 主要用于过手胡检测，听口分数检测
    // 所以不需要检测，杠上炮，抢杠胡，扫底胡等特殊事件
    static getPreScore(params) {
        let { game, mjscoreManage, gamePlayer, triggerPlayer, card } = params;

        // 自摸的检测，不应该走到preScore里
        // 真正的自摸，而不是规则上的自摸，如抢杠胡算自摸，点杠杠开算点炮之类的
        if (gamePlayer == triggerPlayer) {
            return 0
        }
        let player: MJGamePlayer = gamePlayer as MJGamePlayer;
        // player就是要算分或者赢的人
        // 预演算分
        let preCombs = mjscoreManage.preCalcComboScore(player, card)

        // 飘分=赢家飘分+输家飘分
        // 牌型分+牌型分+特殊分项+特殊分项+飘分+杠分

        // 杠分
        let gangScore = ScoreDataBase.getGang(game, mjscoreManage, player.index)

        // 牌型分
        let pinghu = preCombs["pinghu"]
        let pengpenghu = preCombs["duiduihu"]
        let qingyise = preCombs["qingyise"]
        let qidui = preCombs["qidui"]

        if (pengpenghu.result > 0 || qingyise.result > 0 || qidui.result > 0) {
            pinghu.score = 0
            pinghu.result = 0
        }

        let paiTypes = [pinghu, pengpenghu, qingyise, qidui]
        let paiScore = _.reduce(paiTypes, (sum, v) => { return sum += (v.result > 0 ? v.score : 0) }, 0)

        // 特殊分项
        let yibangao = preCombs["yibangao"]
        let queyimen = preCombs["queyimen"]
        let menqing = preCombs["menqing"]

        // 门清与七对不累加
        if (qidui.result > 0) {
            menqing.score = 0
            menqing.result = 0
        }
        let speTypes = [yibangao, queyimen, menqing
            // , preCombs["jingoudiao"]
            // , preCombs["jingoupao"]
            // , preCombs["kaxinwu"]
            // , preCombs["gangshanghua"]
            // , preCombs["ganghoupao"]
            // , preCombs["qiangganghu"]
            // , preCombs["saodihu"]
            // , preCombs["haidipao"]
            // , preCombs["baipai"]
            // , preCombs["baiduzhang"]
        ]
        // v.result 有可能大于1，比如一般高，有两个
        let speScore = _.reduce(speTypes, (sum, v) => { return sum += (v.result > 0 ? v.result * v.score : 0) }, 0)

        let piaoScore = 0
        // triggerPlayer有可能为空，如听口的分
        if (triggerPlayer) {
            //piaoScore = gamePlayer
            piaoScore += this.getPiaoScore(game, gamePlayer.index, triggerPlayer.index);
        }
        return paiScore + speScore + piaoScore + gangScore
    }

}
