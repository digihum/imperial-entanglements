/**
 * @fileOverview Controller for sources
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const falcon_core_1 = require("@digihum/falcon-core");
const GenericController_1 = require("./GenericController");
const Exceptions_1 = require("../../common/Exceptions");
const RecordController_1 = require("./RecordController");
const lodash_1 = require("lodash");
class SourceController extends GenericController_1.GenericController {
    constructor(db) {
        super(db, 'sources');
    }
    toSchema(data) {
        const allowedKeys = new Set(['uid', 'label', 'parent', 'sameAs', 'readonly', 'creator', 'creationTimestamp', 'lastmodifiedTimestamp']);
        const extraKeys = Object.keys(data).filter((a) => !allowedKeys.has(a));
        if (extraKeys.length > 0) {
            throw new Exceptions_1.InvalidUpdateException('Unknown keys: ' + extraKeys.join(', '));
        }
        return Object.assign({}, lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'metaData', 'sameAs', 'parents', 'children', 'creationTimestamp', 'lastmodifiedTimestamp'), {
            same_as: data.sameAs,
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp
        });
    }
    fromSchema(data) {
        return Object.assign(Object.create(falcon_core_1.Source.prototype), Object.assign(lodash_1.omit(data, 'same_as', 'creation_timestamp', 'lastmodified_timestamp'), {
            'sameAs': data.same_as,
            'creationTimestamp': data.creation_timestamp,
            'lastmodifiedTimestamp': data.lastmodified_timestamp
        }));
    }
    // override the getItemJson and getCollectionJson functions to also get information about the
    // metadata associated with the retrieved source
    getMetadata(fields, sourceId) {
        return this.db.getAncestorsOf(sourceId, 'sources')
            .then((parents) => {
            parents = [sourceId].concat(parents);
            return Promise.all(parents.map((parent) => this.db.query().select(fields)
                .from('source_elements')
                .innerJoin('elements', function () { this.on('source_elements.element', '=', 'elements.uid'); })
                .innerJoin('element_sets', function () { this.on('element_sets.uid', '=', 'elements.element_set'); })
                .where({ 'source_elements.source': parent }))).then((results) => {
                const a = lodash_1.groupBy(lodash_1.flatten(results), 'label');
                return Object.keys(a).reduce((prev, cur) => {
                    const meta = lodash_1.omit(a[cur][0], 'source', 'value');
                    meta['values'] = a[cur]
                        .map((val) => ({ source: val.source, value: val.value, uid: val.uid }))
                        .sort((a, b) => parents.indexOf(a.source) - parents.indexOf(b.source));
                    return Object.assign(prev, { [cur]: meta });
                }, {});
            });
        });
    }
    getItemJson(obj, uid) {
        return super.getItemJson(obj, uid)
            .then((source) => {
            if (source.uid === null) {
                throw new Error('could not find source');
            }
            return Promise.all([
                this.getMetadata([
                    'source_elements.source as source',
                    'elements.label',
                    'source_elements.value',
                    'elements.description',
                    'element_sets.label as element_set',
                    'elements.comment',
                    'elements.uri',
                    'elements.uid as element_uid'
                ], source.uid),
                this.db.query().select('uid').from('sources').where({ parent: uid }),
                this.db.getAncestorsOf(uid, 'sources')
            ])
                .then(([sourceElements, children, parents]) => {
                source.metaData = sourceElements;
                source.children = children.map((child) => child.uid).filter((child) => child !== null);
                source.parents = parents;
                return source;
            });
        });
    }
    getCollectionJson(obj, params = {}) {
        return super.getCollectionJson(obj, params)
            .then((sources) => {
            return Promise.all(sources.map((source) => {
                if (source.uid === null) {
                    throw new Error('could not find source');
                }
                return this.getMetadata([
                    'elements.label',
                    'source_elements.value'
                ], source.uid)
                    .then((sourceElements) => {
                    source.metaData = sourceElements;
                    return source;
                });
            }));
        });
    }
    //TODO should find every child source, not just the direct children
    deleteItem(obj, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if this entity is the parent of another entity or if it has any relationships
            // pointing towards it.
            const [records, sources] = yield Promise.all([
                this.db.loadCollection('records', { source: uid }),
                this.db.loadCollection('sources', { parent: uid })
            ]);
            if (records.length + sources.length === 0) {
                return this.db.deleteItem(this.tableName, uid);
            }
            else {
                throw new Exceptions_1.OperationNotPermittedException({
                    message: 'The operation could not be completed as the source is used by other records',
                    data: Promise.resolve({
                        record: records.map((record) => RecordController_1.RecordController.fromSchema(record)),
                        source: sources.map((source) => this.fromSchema(source))
                    })
                });
            }
        });
    }
}
exports.SourceController = SourceController;
//# sourceMappingURL=SourceController.js.map