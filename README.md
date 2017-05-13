# Linux command sync over LAN with UDP #
Broadcast a linux CLI command over LAN and execute immediately on clients for low-latency IoT command sync.

## Architecture: ##
* **Server** : Responsible for broadcasting the bash command via UDP multicast
* **IoT/Linux Clients** : Listen for UDP messages, parse out the bash command, execute it immediately.
* **Websocket Client** : Sends the server a bash command 

## Usage ##
### Server: ###
```
cd PATH/server/
npm install
npm start
```
### Linux Clients ###


(eg. Raspberry Pi, Linux Desktop et. al)

```
cd PATH/linux-client
npm install
npm start
```

### Websocket JSON structure ###
Note: For quick testing, use the Google Chrome Advanced REST Client

#### Desired command to execute on Linux client ####

`someCommand --option1 value1 -o value2 value3`

#### Corresponding Websocket JSON ####

```
  {
    "command":"someCommand",
    "args":["--option1", "value1", "-o", "value2", "value3"]
  }
```

JSON Samples:

`{"command":"raspivid","args":["-o","example_video.h264","-t","20000","-w","1280","-h","720","-fps","30"]}`

`{"command":"ls","args":[]}`

## Copyright and License ##

//Copyright &copy; 2017 Aidan Hoolachan using the [MIT License](https://opensource.org/licenses/MIT).


### Note ###
I developed this small application as a minor testing tool for an IoT project, so I didn't spare time to make it configurable **(but it works!).** I'll add configuration options as needed. I have a few other networking projects on the horizon that will work with webRTC and tcp, so I'll add those modules to the suite.
