/* @flow */

//1. Connect to server
import dotenv from 'dotenv'
import dgram from 'dgram';
import buffer from 'buffer';
import childProcess from 'child_process';

const spawn = childProcess.spawn;
const client = dgram.createSocket('udp4');

dotenv.config();

const UDP_PORT = 6024;
const BROADCAST_ADDRESS = '239.255.255.250';
const LOCAL_IP = process.env.LOCAL_IP;
const HOST_IP = process.env.HOST_IP;

/******************
 * Classes
 ******************/
 class Command {
   command: string;
   args: Array<string>;

   constructor(command: string, args: Array<string>){
     this.command = command;
     this.args = args;
   }
 }

client.on('listening', () => {
  console.log('listening on port');
})

//2. Wait for command
client.on('message', (message, rinfo) => {
  const command: Command = JSON.parse(message);
  console.log('command: ', command.command);
  console.log('args: ', command.args);
  try {
    const executedCommand = spawn(command.command, command.args);
  
    executedCommand.stdout.on('data', (data) => {
      console.log(data);
    });
    executedCommand.stderr.on('data', (data) => {
      console.log(data);
    });
    executedCommand.on('exit', () => {
      console.log('Command Exit');
    });

  } catch(err) {
    console.log(err);
  }
  console.log(Date.now());
  console.log('Message received from server: ' + message.toString())
});

client.on('listening', function () {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
});

client.bind(UDP_PORT, () => {
  client.addMembership(BROADCAST_ADDRESS, LOCAL_IP);
});
