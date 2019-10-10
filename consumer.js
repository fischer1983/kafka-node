var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var client = new kafka.KafkaClient( {kafkaHost: '192.168.25.8:9092'});

consumer = new Consumer(
    client,
    [
        { topic: 'node-test' }
    ],
    {
        autoCommit: false
    }
);

consumer.on('message', function (message) {
    console.log(message);
})
