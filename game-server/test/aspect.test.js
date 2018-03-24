"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const aspect_js_1 = require("aspect.js");
class LoggerAspect {
    invokeBeforeMethod(meta) {
        // meta.woveMetadata == { bar: 42 }
        console.log(meta.woveMetadata);
        console.log(`Inside of the logger. Called ${meta.className}.${meta.method.name} with args: ${meta.method.args.join(', ')}.`);
    }
}
__decorate([
    aspect_js_1.beforeMethod({
        classNamePattern: /^Article/,
        methodNamePattern: /^(get|set)/
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [aspect_js_1.Metadata]),
    __metadata("design:returntype", void 0)
], LoggerAspect.prototype, "invokeBeforeMethod", null);
class Article {
}
let ArticleCollection = class ArticleCollection {
    constructor() {
        this.articles = [];
    }
    getArticle(id) {
        console.log(`Getting article with id: ${id}.`);
        return this.articles.filter(a => {
            return a.id === id;
        }).pop();
    }
    setArticle(article) {
        console.log(`Setting article with id: ${article.id}.`);
        this.articles.push(article);
    }
};
ArticleCollection = __decorate([
    aspect_js_1.Wove({ bar: 42 })
], ArticleCollection);
new ArticleCollection().getArticle(1);
