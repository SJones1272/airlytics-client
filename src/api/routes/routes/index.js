const express = require('express');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    hosts: ['http://24.2.97.148:9200']
});

let router = express.Router();

router.get("/airline/:iata", async function (req, res) {
    let results = await retrieveRoutesForAirline(req.params['iata']);
    res.send(results)
});

router.get("/", async function (req, res) {
    let results = await retrieveRoutes();
    res.send(results)
});

async function retrieveRoutes() {
    let elasticResults = await client.search({
        index: 'routes',
        type: 'routes',
        body: {
            query: {
                "match_all": {}
            },
            "aggs": {
                "originAgg": {
                    "terms": {
                        "field": "sourceAirport.keyword",
                        "size": 5000,
                        "order": {
                            "_term": "asc"
                        }
                    },
                    "aggs": {
                        "destinationAgg": {
                            "terms": {
                                "field": "destinationAirport.keyword",
                                "size": 5000,
                                "order": {
                                    "_term": "asc"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    let data = elasticResults.aggregations.originAgg.buckets;
    let results = {};
    for (let i = 0; i < data.length; i++) {
        let destinations = data[i].destinationAgg.buckets;
        let destinationEntries = [];
        for (let j = 0; j < destinations.length; j++) {
            destinationEntries.push(destinations[j]['key']);
        }
        results[data[i].key] = destinationEntries;
    }
    return results

}

async function retrieveRoutesForAirline(airlineCode) {
    let elasticResults = await client.search({
        index: 'routes',
        type: 'routes',
        body: {
            query: {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "airline.keyword": `${airlineCode}`
                            }
                        }
                    ]
                }
            },
            "aggs": {
                "originAgg": {
                    "terms": {
                        "field": "sourceAirport.keyword",
                        "size": 5000,
                        "order": {
                            "_term": "asc"
                        }
                    },
                    "aggs": {
                        "destinationAgg": {
                            "terms": {
                                "field": "destinationAirport.keyword",
                                "size": 5000,
                                "order": {
                                    "_term": "asc"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    let data = elasticResults.aggregations.originAgg.buckets;
    let results = {
        "iata": airlineCode
    };
    for (let i = 0; i < data.length; i++) {
        let destinations = data[i].destinationAgg.buckets;
        let destinationEntries = [];
        for (let j = 0; j < destinations.length; j++) {
            destinationEntries.push(destinations[j]['key']);
        }
        results[data[i].key] = destinationEntries;
    }
    return results
}


module.exports = router;