'use strict';

/* Magic Mirror
* Module: MMM-Halloween
*
* By Djtale
* MIT Licensed.
*/

const NodeHelper = require('node_helper');
const Gpio = require('onoff').Gpio;
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const {PythonShell} = require('python-shell');
var kill = require('tree-kill');
var pythonStarted = false;
var child;

module.exports = NodeHelper.create({
	start: function () {
		this.countDown = 10000000
		this.started = false
		//this.shell = null
	},

	python_start: function () {
		const self = this;
		console.log("MMM-Halloween - PYTHON started");
		
		/* AVEC SPAWN */
		var scriptArgs = ["/home/pi/MagicMirror/modules/" + this.name + "/living_portrait_player.py"];
		child = spawn("python3",scriptArgs);
		/* AVEC SPAWN */
		
		/* AVEC EXEC */
		/*var child = exec("python3 /home/pi/MagicMirror/modules/" + this.name + "/living_portrait_player.py", function(err, stdout, stderr){
			console.log(stdout);
		});*/
		/* AVEC EXEC */


		/* AVEC PYTHON_SHELL */
		/*const pyshell = new PythonShell('modules/' + this.name + '/living_portrait_player.py', null)
		pyshell.on('message', function (message) {
			if (message.hasOwnProperty('status')){
				console.log("[" + self.name + "] " + message.status);
			}
		});

		pyshell.end(function (err) {
			if (err) throw err;
			console.log("[" + self.name + "] " + 'finished running...');
		});*/
		/* AVEC PYTHON_SHELL */

		console.log("MMM-Halloween - PYTHON executed");
	},


	python_stop: function () {
		const self = this;
		console.log("MMM-Halloween - PYTHON killed");
		
		/*AVEC SPAWN */
		kill(child.pid); //à utiliser avec spawn
		/*AVEC SPAWN */
		
		/* AVEC EXEC */
		/*exec('pgrep -f python3', function(err, stdout, stderr) {
			console.log('stdout' + stdout);
			pid_python3 = stdout;
			console.log('pid_python3 ' + pid_python3);
		});
		kill(pid_python3);*/
		
		
		exec('pgrep -f omxplayer.bin', function(err, stdout, stderr) {
			console.log('stdout' + stdout);
			pid_omxplayer = stdout;
			console.log('pid_omxplayer ' + pid_omxplayer);
		});
		kill(pid_omxplayer);
		/* AVEC EXEC */

		// Send SIGHUP to process.
		//grep.kill('SIGHUP');
		console.log("MMM-Halloween - process SIGHUP");
	},


	// Subclass socketNotificationReceived received.
	socketNotificationReceived: function (notification, payload) {
		switch(notification) {
			case "INIT":
				console.log("MMM-Halloween - INIT notification received");
				//this.job(payload)
				this.config = payload
				//if(!pythonStarted) {
					pythonStarted = true;
					this.python_start();
				//};
				break
			case "CONFIG":
				console.log("MMM-Halloween - CONFIG notification received");
				if (this.started == false) {
					const self = this;
					this.config = payload;

					// Setup for sensor pin
					this.pir = new Gpio(this.config.sensorPin, 'in', 'both');

					// Setup value which represent on and off
					const valueOn = this.config.sensorState;
					const valueOff = (this.config.sensorState + 1) % 2;

					// Detected movement
					/*
					this.pir.watch(function (err, value) {
						if (value == valueOn) {
							self.sendSocketNotification('USER_PRESENCE', true);
						}
						else if (value == valueOff) {
							self.sendSocketNotification('PAUSE_VIDEO', false);
						}
					});*/
				
					this.started = true;
				}
				break;
			case "QUIT":
				console.log("MMM-Halloween - QUIT notification received");
				this.config = payload
				if(pythonStarted) {
					pythonStarted = false;
					this.python_stop();
					this.sendSocketNotification(notification, payload)
				};
				break
			case "DO_YOUR_JOB":
				console.log("MMM-Halloween - DO_YOUR_JOB notification received");
				this.sendSocketNotification("I_DID", (this.countDown - payload))
				break;
		}
	},
});
