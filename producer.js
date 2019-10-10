//https://www.npmjs.com/package/kafka-node
//https://www.npmjs.com/package/kafka-node-avro

var avroSchema = {
    name: 'MyAwesomeType',
    type: 'record',
    fields: [
      {
        name: 'id',
        type: 'string'
      }, {
        name: 'timestamp',
        type: 'double'
      }, {
        name: 'enumField',
        type: {
          name: 'EnumField',
          type: 'enum',
          symbols: ['sym1', 'sym2', 'sym3']
        }
      }]
  };

var avro = require('avsc');
var type = avro.parse(avroSchema);

var kafka = require('kafka-node');
var HighLevelProducer = kafka.HighLevelProducer;
var KeyedMessage = kafka.KeyedMessage;
//var Client = kafka.Client;

var client = new  kafka.KafkaClient( {kafkaHost: '192.168.25.8:9092'} );
  
  // For this demo we just log client errors to the console.
  client.on('error', function(error) {
    console.error(error);
  });

  var producer = new HighLevelProducer(client);

  producer.on('ready', function() {
    // Create message and encode to Avro buffer
    var messageBuffer = type.toBuffer({
      enumField: 'sym1',
      id: '3e0c63c4-956a-4378-8a6d-2de636d191de',
      timestamp: Date.now()
    });
  
    // Create a new payload
    var payload = [{
      topic: 'node-test',
      messages: messageBuffer,
      attributes: 1 /* Use GZip compression for the payload */
    }];
  
    //Send payload to Kafka and log result/error
    producer.send(payload, function(error, result) {
      console.info('Sent payload to Kafka: ', payload);
      if (error) {
        console.error(error);
      } else {
        var formattedResult = result[0];
        console.log('result: ', result)
      }
    });
  });
  
  // For this demo we just log producer errors to the console.
  producer.on('error', function(error) {
    console.error(error);
  });  

