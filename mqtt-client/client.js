const mqtt = require('mqtt')
const client = mqtt.connect("mqtt://broker.hivemq.com:1883")
var five = require('johnny-five');
const mqttWildcard = require('mqtt-wildcard')

// Hardware
var board = new five.Board();

// Relevant topics
var allTopics = "/lights/#"
var lightOn = "/lights/+/lightOn"
var masterOn = "/lights/masterOn"

// Client connect
client.on('connect', () => {
    client.subscribe(allTopics);
    console.log('mqtt connected');
})

board.on("ready", function() {
    const led_1 = new five.Led(2)
    const led_2 = new five.Led(3)
    const led_3 = new five.Led(4)
    const led_4 = new five.Led(5)
    const led_5 = new five.Led(6)
    const led_6 = new five.Led(7)
    const led_7 = new five.Led(8)
    const led_8 = new five.Led(9)
    const led_9 = new five.Led(10)
    const led_10 = new five.Led(11)

    const leds = [led_1, led_2, led_3, led_4, led_5, 
        led_6, led_7, led_8, led_9, led_10]

    client.on('message', (topic, message) => {

        // string split to get light id
        if (mqttWildcard(topic, lightOn)) {
            const splits = topic.split("/")
            const id = splits[2]
            console.log(`id: ${id}, lightOn: ${message}`)

            if (message == "true") leds[id - 1].on()
            else leds[id - 1].off()
        }
        else if (topic == masterOn) {
            console.log("MasterOn: " + message)
            if (message == "true"){
                for (let i = 0; i < leds.length; i++) {
                    leds[i].on()
                }
            }
            else {
                for (let i = 0; i < leds.length; i++) {
                    leds[i].off()
                }
            }
        }
    })
});
