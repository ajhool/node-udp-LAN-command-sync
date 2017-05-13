/* @flow */
//Copyright © 2017 Aidan Hoolachan using MIT License.

import dgram from 'dgram';
import buffer from 'buffer';
import ws from 'ws';

const SRC_PORT = 6025;
const UDP_PORT = 6024;
const WS_PORT = 8080;

const BROADCAST_ADDR = '239.255.255.250';
const LOCAL_IP = '192.168.1.102';

/***************
 * Utilities
 ***************/

function broadcastCommandUDP(udpServer, command : Command){
  const message = buildCommand(command);
  console.log('message: ' + message);
  const buf = messageToBuffer(message);

  udpServer.send(buf, 0, buf.length, UDP_PORT, BROADCAST_ADDR, () => {
    console.log('sent: ', buf);
  });
}

function messageToBuffer(message:string ){
  return Buffer.from(message);
}

function buildCommand(command: Command){
  const literal = {command: command.command, args: command.args};
  return JSON.stringify(literal);
}

/******************
 * Classes
 ******************/
class Command {
  command : string;
  args : Array<string>;

  constructor(command: string, args: Array<string>){
    this.command = command;
    this.args = args;
  }

  toString(){
    return '{"command":"'+this.command + '", "args":'+JSON.stringify(this.args)+'}';
  }
}

/*************
 * UDP Server Configuration: Low-latency broadcast to connected devices that need to send data
 *   In realtime.
 *************/
const udpServer = dgram.createSocket('udp4');

udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log('udpServer listening ' + address.address +':'+address.port);
});

//Initialize UDP server to broadcast messages to all connected devices over LAN
// - Low-latency
udpServer.bind(SRC_PORT, LOCAL_IP, () => {
   udpServer.setBroadcast(true);
   udpServer.setMulticastTTL(128);
   //udpServer.addMembership(BROADCAST_ADDR, LOCAL_IP);
 }
);

/***************************
 * Websocket Configuration. Accept commands from human interfaces
 ***************************/
//Initialize Websocket server that will receive commands from human interface.
const wss = new ws.Server({
  port: WS_PORT
}, () => {console.log('Websocket Server listening on : ' + WS_PORT )});

wss.on('connection', function connection(connection) {
  connection.on('message', function incoming(data, flags) {
    console.log('Websocket message: ', data);
    const parsedData = JSON.parse(data);
    console.log(parsedData);
    try{
      const command = new Command(parsedData.command, parsedData.args);

      if(command.command && command.args){
        broadcastCommandUDP(udpServer, command);
      } else {
        console.log("Could not format command", data, command);
      }
    } catch (err) {
      console.log(err);
    }
  });

  connection.on('close', function close() {
    console.log('Disconnection');
  });

  console.log('New Connection');
});
