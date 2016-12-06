var redis = require('then-redis');
var Knex = require('knex');

const PREDICATE_TABLE_NAME = 'predicates';

const client = redis.createClient();

const knex = Knex({
  client: 'sqlite3',
  connection: {
    filename: './data/mydb.sqlite'
  }
});

var locationlevels = ["country", "place", "street", "address"];

function build(hierarchy, level, parentId, name, depth) {

	return client.exists(`h:${hierarchy}:${level}`)
	.then((exists) => {
		if(exists == 1) {
			return client.hgetall(`h:${hierarchy}:${level}`)
			.then((topLevel) => {
				if(topLevel === undefined || topLevel === null) {
					console.log("Didn't work", hierarchy, level, parentId, name, depth);
					return;
				}
				return client2.hincrby("count", "e", 1)
				.then((id) => {
					return Promise.all(Object.keys(topLevel).map((key) => {
						let value = topLevel[key];
						let promises = [];
						if(parentId !== null) {
							promises.push(client2.hmset(`e:${id}`,"@type", locationlevels[depth-1], "@id", id, "name", name));
							promises.push(client2.hset(`e:${id}`,`locatedIn`, parentId));
						} 
						if(key == "#lat" && topLevel["#lng"] !== undefined) {
							promises.push(client2.hset(`e:${id}`,`latLng`, `${topLevel["#lat"]},${topLevel["#lng"]}`));
						}
						if(key[0] != "#") promises.push(build(hierarchy, value, id, key, depth + 1));
						return Promise.all(promises);
					}));
					
				});
			});
		} else {			
			if(parentId !== null) {
				return client2.hincrby("count", "e", 1)
				.then((id) => {					
					return client2.hmset(`e:${id}`,"@type", locationlevels[depth-1], "@id", id, "name", name, `locatedIn`, parentId);					
				});
			} 
		}
	});

	
}


let sourceMap = {};
let predMap = {id: "id"};

Promise.all([
	knex(PREDICATE_TABLE_NAME).del(),
	knex(PREDICATE_TABLE_NAME + "_ref").del(),
	knex(PREDICATE_TABLE_NAME + "_val").del()
])

.then(() => client.hgetall("fields"))
.then((res) => {
	return Promise.all(Object.keys(res).map((id) => client.hgetall(`field:${res[id]}`)))
	.then((results) => {		
		return Promise.all(results.map((data) => {
			predMap[data.slug] = data.name;
			console.log(data);
			return knex(PREDICATE_TABLE_NAME).insert({
				name: data.name,
				domain: 'Person'
			}).then((id) => {
				if(data.type === 'string' || data.type == 'date') {
					return knex(PREDICATE_TABLE_NAME + "_val").insert({
						uid: id[0],
						range: data.type
					});
				} else {
					
					if(data.type === 'hierarchy') {
						if(data.subtype === 'occupation') {
							return knex(PREDICATE_TABLE_NAME + "_ref").insert({
								uid: id[0],
								range: 'Occupation'
							});
						} 

						if(data.subtype === 'location') {
							return knex(PREDICATE_TABLE_NAME + "_ref").insert({
								uid: id[0],
								range: 'Location'
							});
						}
					}

					if(data.type === 'relationship') {
						return knex(PREDICATE_TABLE_NAME + "_ref").insert({
							uid: id[0],
							range: 'Person'
						});
					}
				}
			});
		}));
	})	
})

.then(() => client.scan(0, "MATCH", "source:*", "COUNT", 10000000))
.then((res) => {
			
	return Promise.all(res[1].map((id) => client.hgetall(id)))
	.then((results) => {

		return Promise.all(results.map((data, j) => {
			console.log(data);
			// return client2.hincrby("count", "e", 1)
			// .then((id) => {
			// 	sourceMap[data.id] = id;
			// 	client2.hmset(`e:${id}`,"@type", "source", "@id", id)
			// 	.then(() => Promise.all(Object.keys(data).map((key) => {
			// 		return client2.hset(`e:${id}`, key, data[key]);
			// 	})))
			// 	.then(() => client2.hdel(`e:${id}`, "id"));			
			// });				
		}));
	})	
})

.then(() => process.exit(0))

.catch((err) => console.log(err));

/*.then(() => {
	return Promise.all([
		client2.hset("c:person", "name", "person"),
		client2.hset("c:location", "name", "location"),
		client2.hmset("c:country", "name", "country", "@super", "location"),
		client2.hmset("c:place", "name", "place", "@super", "location"),
		client2.hmset("c:street", "name", "street", "@super", "location"),
		client2.hmset("c:address", "name", "address", "@super", "location"),
		client2.hset("c:source", "name", "source"),
		client2.hset("c:occupation", "name", "occupation"),
		client2.hset("c:sex", "name", "sex"),
		client2.hset("count", "r", 23119),
		client2.hset("count", "m", 20316),
		client2.hset("count", "e", 1770),
		client2.hmset(`p:latLng`,"domain", "location", "range", "@hl:latLng"),
		client2.hmset(`p:locatedIn`,"domain", "location", "range", "location"),
		client2.hmset(`p:locationLevel`,"domain", "location", "range", "@xs:string"),
		client2.hmset(`p:creationDate`,"domain", "source", "range", "@hl:fuzzyDate"),
		client2.hmset(`p:notes`,"domain", "*", "range", "@xs:string"),
		client2.hmset(`p:sourceType`,"domain", "source", "range", "@xs:string")
	]);
})

.then(() => client.zrange(["people", 0, -1]))
.then((res) => {
	return Promise.all(Object.keys(res).map((id) => client.hgetall(`person:${res[id]}`)))
	.then((results) => {
		return Promise.all(results.map((data) => {
			return client2.hmset(`e:${data.id}`,"@type", "person", "@id", data.id)
			.then(() => Promise.all(Object.keys(data).map((key) => client2.hset(`e:${data.id}`, predMap[key], data[key]))))
			.then(() => client2.hdel(`e:${data.id}`, "id"))
			.then(() => client2.zadd(`in:people`, data.id, data.id));				
		}));
	})	
})
.then(() => client.scan(0, "MATCH", "record:*", "COUNT", 10000000))
.then((res) => {
	return Promise.all(res[1].map((id) => client.hgetall(id)))
	.then((results) => {
		return Promise.all(results.map((data) => {
			data["meta:source_id"] = sourceMap[data["meta:source_id"]];
			return client2.hset(`r:${data['meta:id']}`,"data", JSON.stringify(data));
		}));
	})	
})
.then(() => client.scan(0, "MATCH", "propmap:*", "COUNT", 10000000))
.then((res) => {
			
	return Promise.all(res[1].map((id) => client.zrange(id, 0, -1, "WITHSCORES")))
	.then((results) => {

		console.log("OO", results.length)
		return Promise.all(results.map((data, j) => {
			var promises = [];
			for(let i=0; i<data.length; i+=2) {
				promises.push(client2.zadd("m:" + res[1][j].substring(8), data[i+1], data[i]))
			}
			return Promise.all(promises);
		}));
	})	
})
.then(() => {
	return build("location", "0", null, "", 0);
}).then(() => {
	return build("sex", "0", null, "", 0);
}).then(() => {
	return build("occupation", "0", null, "", 0);
})
.then(() => process.exit(0))
.error((err) => {
	console.error(err);
	process.exit(1);
});*/
