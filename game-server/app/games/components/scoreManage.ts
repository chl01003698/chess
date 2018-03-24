import * as _ from 'lodash'

export class Score {
  constructor(score: number, type: number, sourceId?: string, targetId?: string, data?) {
    this.score = score
    this.type = type
    this.sourceId = sourceId
    this.targetId = targetId
    this.data = data
  }
  score: number = 0
  type: number = -1
  data?: any
  sourceId?: string
  targetId?: string
}

export function createMultipleScore(multiple: number = 2, data: any = null, type: number = -1) {
  return new Score(multiple, type, "", "", data)
}

export class ScoreManage {
  public scores: Array<Score> = []

  pushScore(score: Score) {
    this.scores.push(score)
  }

  pushTargetScore(score: Score) {
    const targetScore = new Score(-score.score, score.type, score.targetId, score.sourceId, score.data)
    this.scores.push(targetScore)
  }

   sumScores(): number {
    return _.sumBy(this.scores, 'score')
  }

   sumScoresByMultiple(baseScore: number): number {
    let sum = baseScore
    _.forEach(this.scores, function(v) {
      sum *= v.score
    })
    return sum
  }

   sumPositiveScores(): number {
    let filterScores = _.filter(this.scores, function(v) { return v.score > 0 })
    return _.sumBy(filterScores, 'score')
  }

   sumNegativeScores(): number {
    let filterScores = _.filter(this.scores, function(v) { return v.score < 0 })
    return _.sumBy(filterScores, 'score')
  }

   sumScoresByType(type: number) {
    return _.sumBy(this.scores, function(v) {
      if (v.type == type) {
        return v.score
      }
      return 0
    })
  }

   removeScoresByTypes(types: Array<number>): Array<Score> {
    return _.filter(this.scores, function(v) {
      return !_.includes(types, v.type)
    })
  }

   removePositiveScoresByType(type: number) {
    return _.filter(this.scores, function(v) {
      return (v.type != type && v.score > 0)
    })
  }

   removeNegativeScoresByType(type: number) {
    return _.filter(this.scores, function(v) {
      return (v.type != type && v.score < 0)
    })
  }

   rejectScores(condition: object) {
    return _.reject(this.scores, condition)
  }

   updateScoresZero(condition: object) {
    _.forEach(this.scores, function(v) {
      if (_.isMatch(v, condition)) {
        v.score = 0
      }
    })
  }

   existScoreType(type: Number): Boolean {
    return _.find(this.scores, { 'type': type }) != undefined
  }
}
