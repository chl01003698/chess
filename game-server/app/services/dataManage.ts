import * as low from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import * as Memory from 'lowdb/adapters/Memory';
import axios from 'axios';
import * as config from 'config';
import * as Raven from 'raven';
import * as schedule from 'node-schedule';
import * as merge from 'deepmerge'
import * as _ from 'lodash'

const dataConfig = config.get('data')

export default class DataManage {
	config: low;
	dataList: Map<string, low> = new Map<string, low>()

	constructor() {
		
	}

	getMergeData(configList: Array<string>) {
		const configData: Array<any> = []
		_.forEach(configList, (v) => {
			if (this.dataList.has(v)) {
				configData.push(this.dataList.get(v).value())
			}
		})
		const dontMerge = (destination, source) => source
		return merge.all(configData, { arrayMerge: dontMerge })
	}

	getData(name: string) {
		let data
		if (this.dataList.has(name)) {
			data = this.dataList.get(name).value()
		}
		return data
	}

	async loadData() {
		Raven.context(async ()=> {
			this.dataList.clear()
			console.log("..........................")
			console.log(dataConfig)
			console.log("..........................")
			if (dataConfig.pattern == 'remote') {
				this.config = low(new Memory());
				const response = await axios.get(dataConfig.remoteConfigURL);
				const jsonObject = response.data;
				this.config.setState(jsonObject).write();

				for (const name in dataConfig.list) {
					this.dataList.set(name, low(new Memory()))
					const response = await axios.get(`${dataConfig.url}${dataConfig.list[name]}`);
					const jsonObject = response.data;
					this.dataList.get(name).setState(jsonObject).write();
				}
			} else if (dataConfig.pattern == 'local') {
				this.config = low(new FileSync(dataConfig.localConfigPath))
				for (const name in dataConfig.list) {
					this.dataList.set(name, low(new FileSync(`${dataConfig.path}${dataConfig.list[name]}`)))
				}
			}
		})
	}

	checkNewData() {
		const rule = new schedule.RecurrenceRule();
		rule.minute = new schedule.Range(0, 59, 10);
		const j = schedule.scheduleJob(rule, () => {
			this.loadData()
		});
	}
}
