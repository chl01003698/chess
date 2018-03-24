import axios from 'axios';
const KeywordFilter = require('keyword-filter')
const filter = new KeywordFilter();
const fs = require('fs');
const filePath = './data/keyword.txt'


export default class KeywordManager{
    public static async loadKeyword(){
      const data = await fs.readFileSync(filePath, {encoding: 'utf-8'});
      const keywords = data.split(/\r?\n/);
      // console.log('keywords=>',keywords);
      filter.init(keywords);
    }

    public static async loadRomoteKeyword(url:string){
      try {
        const response = await axios.get(url);
        await fs.writeFileSync(filePath, response.data);
        await this.loadKeyword();
      } catch (error) {
        // logger.error(error);
      }
    }

    public static hasKeyword(word:string){
      if(filter.hasKeyword(word)) return true;
      return false;
    }


}