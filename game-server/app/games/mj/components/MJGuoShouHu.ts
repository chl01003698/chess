import * as _ from 'lodash'

export class MJGuoShouData{
	guoCard:number = -1
	guoScore:number = 0
	triggerUid:string = ""

	constructor(params){
		this.guoCard = params.card
		this.guoScore = params.score
		this.triggerUid = params.uid
	}
	reset(){
		this.guoCard = -1
		this.triggerUid = ""
		this.guoScore = 0
	}

	setInfo(params){
		console.log("guoshoudata ")
		console.log(params)
		this.guoCard = params.card
		this.guoScore = params.score
		this.triggerUid = params.uid
	}
}

export class MJGuoShouHu {
	guoData = {}
	
	// 分数限制，默认加分也不可胡
	scoreLimit:boolean = false
	// 限制单张，还是所有，默认限制所有
	cardLimit:boolean = false

	constructor(private game:any, params){
		this.scoreLimit = _.defaultTo(params.scoreLimit, false)
		this.cardLimit = _.defaultTo(params.cardLimit, false)
	}
	
	reset(idx:number){
		console.log("guoshouhu reset")
		console.log(idx)
		delete this.guoData[idx]
	}
	
	setInfo(params){
		this.guoData[params.index] = new MJGuoShouData(params)
	}

	//canHu(params){
	//	if(this.guoCard == -1){
	//		return true
	//	}
	//	
	//	if(this.guoLimit1){
	//		return false
	//	}
	//}
	// 是否存在限制
	// 还是已经清除，还是初始状态
	canHu(params){
		console.log("guoshouhu canhu")
		console.log(params)

		const data = this.guoData[params.index]
		if(!data) return true
				
		console.log(data)

		if(data.guoCard == -1){
			return true
		}

		if(this.scoreLimit == false){
			// 针对所有
			if(this.cardLimit == false){
				return false
			}
			// 针对单张
			else{
				return data.guoCard != params.card
			}
		}
		else{
			if(params.score <= data.guoScore){
				return false
			}
			if(this.cardLimit == true){
				return data.guoCard != params.card
			}
			else{
				return true
			}
		}
	}
}
