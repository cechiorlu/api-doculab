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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentResolver = void 0;
const TextDoc_1 = require("../entities/TextDoc");
const type_graphql_1 = require("type-graphql");
const uuid_1 = require("uuid");
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let DocumentResponse = class DocumentResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], DocumentResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => TextDoc_1.TextDoc, { nullable: true }),
    __metadata("design:type", TextDoc_1.TextDoc)
], DocumentResponse.prototype, "doc", void 0);
DocumentResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], DocumentResponse);
let DocumentResolver = class DocumentResolver {
    doc(id) {
        return TextDoc_1.TextDoc.findOne(id);
    }
    docs() {
        return TextDoc_1.TextDoc.find();
    }
    createDocument({ req, res }) {
        return TextDoc_1.TextDoc.create({
            id: (0, uuid_1.v4)(),
            creatorId: 1
        }).save();
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => TextDoc_1.TextDoc, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "doc", null);
__decorate([
    (0, type_graphql_1.Query)(() => [TextDoc_1.TextDoc], { nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DocumentResolver.prototype, "docs", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => TextDoc_1.TextDoc),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DocumentResolver.prototype, "createDocument", null);
DocumentResolver = __decorate([
    (0, type_graphql_1.Resolver)(of => TextDoc_1.TextDoc)
], DocumentResolver);
exports.DocumentResolver = DocumentResolver;
//# sourceMappingURL=document.js.map