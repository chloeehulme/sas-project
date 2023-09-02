const mqtt = require('mqtt')
const client = mqtt.connect("mqtt://broker.hivemq.com:1883")
const mqttWildcard = require('mqtt-wildcard')

// Relevant topics
var allTopics = "/lights/#"
var lightOn = "/lights/+/lightOn"
var masterOn = "/lights/masterOn"

// Client connect
client.on('connect', () => {
    client.subscribe(allTopics);
    console.log('mqtt connected');
})

client.on('message', (topic, message) => {

    // string split to get light id
    if (mqttWildcard(topic, lightOn)) {
        const splits = topic.split("/")
        const id = splits[2]
        console.log(`id: ${id}, lightOn: ${message}`)
    }
    else if (topic == masterOn) {
        console.log("MasterOn: " + message)
    }
})
