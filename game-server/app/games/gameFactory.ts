import * as Joi from 'joi'
import Chat from './components/chat';
import Channel from './components/channel';
import CountDown from './components/countDown';
import * as Keyv from 'keyv'
import FriendSanZhangGame from './poker/sanzhang/friendSanZhangGame';
import SanZhangGamePlayer from './poker/sanzhang/sanZhangGamePlayer';
import { EventEmitter2 } from 'eventemitter2';
import { CardAdapter } from './components/cardAdapter';
import GameController from './components/controllers/gameController';
import { RoomPay } from './components/roomPay';
import { ScoreManage } from './components/scoreManage';
import { PlayerStateManage } from './components/playerStateManage';
import FriendDouDiZhuGame from './poker/doudizhu/friendDoudizhuGame';
import DiZhuGamePlayer from './poker/doudizhu/diZhuGamePlayer';
import GameRecord from './components/gameRecord';
import PlayBack from './components/playback';
import FriendGame from './friendGame';
import FriendGamePlayer from './friendGamePlayer';
import PokerGamePlayer from './poker/pokerGamePlayer';
import FriendGameController from './components/controllers/friendGameController';
import { BankerStrategy } from './components/bankerStrategy';
import * as _ from 'lodash'
import * as deepmerge from 'deepmerge';
import { MJBanker } from './mj/components/MJBanker';
import { MJOver } from './mj/components/MJOver';
import { MJActionManage } from './mj/components/MJActionManage';
import { MJComboManage } from './mj/components/MJComboManage';
import { MJEventManage } from './mj/components/MJEventManage';
import { MJScoreManage } from './mj/components/MJScoreManage';
import { MJTriggerManage } from './mj/components/MJTriggerManage';
import FriendMJGameController from './components/controllers/friendMJGameController';
import FriendMJNCGame, { processGameConfig_MJNC } from './mj/sichuan/nanchong/FriendMJNCGame';
import MJNCGamePlayer from './mj/sichuan/nanchong/MJNCGamePlayer';
import { GameESearch } from './components/gameESearch';
import { MJFormulaManage } from './mj/components/MJFormulaManage';
import FriendMJXZGame from './mj/sichuan/xuezhandaodi/FriendMJXZGame';
import MJXZGamePlayer from './mj/sichuan/xuezhandaodi/MJXZGamePlayer';
import { MJRuleManage } from './mj/components/MJRuleManage';
import { MJRulerObjManage } from './mj/components/MJRulerObjManage';

declare module "bottlejs" {
    interface IContainer {
        chat: Chat
        channel: Channel
        watchChannel: Channel
        countDown: CountDown
        keyv: Keyv
        emitter: EventEmitter2
        cardAdapter: CardAdapter
        controller: FriendGameController,
        roomPay: RoomPay
        scoreManage: ScoreManage
        playerStateManage: PlayerStateManage
        gameRecord: GameRecord,
        playback: PlayBack,
        bankerStrategy: BankerStrategy,
        esearch: GameESearch,
        mjbanker: MJBanker,
        mjover: MJOver,
        mjactionManage: MJActionManage,
        mjcomboManage: MJComboManage,
        mjRuleManage:MJRuleManage,
        mjeventManage: MJEventManage,
        mjscoreManage: MJScoreManage,
        mjtriggerManage: MJTriggerManage,
        mjcontroller: FriendMJGameController,
      mjformulaManage: MJFormulaManage,
			mjrulerobjManage: MJRulerObjManage
    }
}

interface CreateGameConfig {
    GameType?: any,
    GamePlayerType?: any,
    config?: string,
    processGameConfig?: (roomConfig, gameConfig) => any
}

export default class GameFactory {
    // fangzuobi: Joi.boolean().default(false).optional() // 防作弊 看牌之后只能比拼
    topGameConfigs = new Map<string, CreateGameConfig>()
    gameConfigs = new Map<string, Map<string, CreateGameConfig>>()

    initGames() {
        this.register('sanzhang', {
            GameType: FriendSanZhangGame,
            GamePlayerType: SanZhangGamePlayer,
            config: ''
        })

        this.register('doudizhu', {
            GameType: FriendDouDiZhuGame,
            GamePlayerType: DiZhuGamePlayer,
            config: ''
        })

        this.addGames('doudizhu', 'ddz3', { config: "ddz3" })

        this.addGames('doudizhu', 'sd3', { config: "sd3" })

        this.addGames('doudizhu', 'ddz2', { config: "ddz2" })

        this.addGames('doudizhu', 'ddz4', { config: "ddz4" })

        this.addGames('doudizhu', 'pz3', { config: "pz3" })

        this.addGames('doudizhu', 'lz3', { config: "lz3" })

        this.addGames('doudizhu', 'tdlz3', { config: "tdlz3" });
        this.addGames("sanzhang", "sd", { config: "sanzhang" });
        this.addGames("sanzhang", "pt", { config: "sanzhang" })
        this.addGames("sanzhang", "sanzhang", { config: "sanzhang" })
        this.addGames("sichuan", "nanchong", { config: "sichuan_nanchong", GameType: FriendMJNCGame, GamePlayerType: MJNCGamePlayer,processGameConfig:processGameConfig_MJNC})
        this.addGames("sichuan", "xuezhandaodi", { config: "sichuan_xuezhandaodi", GameType: FriendMJXZGame, GamePlayerType: MJXZGamePlayer})
    }

    register(game: string, createGameConfig: CreateGameConfig) {
        this.topGameConfigs.set(game, createGameConfig)
    }

    addGames(game: string, types: Array<string> | string, createGameConfig: CreateGameConfig) {
        if (!this.gameConfigs.has(game)) {
            this.gameConfigs.set(game, new Map<string, CreateGameConfig>())
        }
        if (_.isString(types)) {
            this.gameConfigs.get(game)!.set(types as string, createGameConfig)
        } else if (_.isArray(types)) {
            _.forEach(types, (v) => {
                this.gameConfigs.get(game)!.set(v, createGameConfig)
            })
        }
    }

    getConfig(game: string, type?: string): CreateGameConfig {
        let topGameConfig: CreateGameConfig = {}
        let gameConfig: CreateGameConfig = {}
        if (this.topGameConfigs.has(game)) {
            topGameConfig = this.topGameConfigs.get(game) as CreateGameConfig
        }
        if (_.isString(type) && type != "" && this.gameConfigs.has(game) && this.gameConfigs.get(game)!.has(type!)) {
            gameConfig = this.gameConfigs.get(game)!.get(type!)!
        }
        let obj:object = _.assign({}, topGameConfig, gameConfig);
        return obj
    }
}
