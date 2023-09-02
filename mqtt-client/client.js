const mqtt = require('mqtt')
const client = mqtt.connect("mqtt://broker.hivemq.com:1883")
const mqttWildcard = require('mqtt-wildcard')

var allTopics = "/lights/#"
var lightOn = "/lights/+/lightOn"
var masterOn = "/lights/masterOn"

client.on('connect', () => {
    client.subscribe(allTopics);
    console.log('mqtt connected');
})

client.on('message', (topic, message) => {
    if (mqttWildcard(topic, lightOn)) {
        const splits = topic.split("/")
        const id = splits[2]
        // string split to get id value
        // console log id value and message
        console.log(`id: ${id}, lightOn: ${message}`)
    }
    else if (topic == masterOn) {
        console.log("MasterOn: " + message)
    }
})