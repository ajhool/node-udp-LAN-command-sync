/* @flow */

//1. Connect to server
import dgram from 'dgram';
import buffer from 'buffer';
import childProcess from 'child_process';

const spawn = childProcess.spawn;
const client = dgram.createSocket('udp4');

const UDP_PORT = 6024;
const BROADCAST_ADDRESS = '239.255.255.250';
const LOCAL_IP = '192.168.1.102';
const HOST_IP = '192.168.1.102';

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
  console.log('Message from: ' + rinfo.address + ':' + rinfo.port + ' - ' + message);
  const command: Command = JSON.parse(message);

  const executedCommand = spawn(command.command, command.args, (err, stdout, stderr) => {
    console.log("error: ", err);
    console.log("stdout: ", stdout);
    console.log("stderr: ", stderr);
  })

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
