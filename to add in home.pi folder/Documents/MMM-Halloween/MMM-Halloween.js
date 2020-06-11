/* global Module */

/* Magic Mirror
 * Module: MMM-Halloween
 *
 * By Djtale
 * MIT Licensed.
 */

Module.register("MMM-Halloween",{
	// Default module config.
	defaults: {
		sensorPin: 17,
		sensorState: 1,
		videoFile: '',
	},
	
	start: function () {
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
		this.count = 0
	},
	
	getDom: function() {
		var element = document.createElement("div")
		element.className = "myContent"
		element.innerHTML = "MMM-Halloween loading..."
		var subElement = document.createElement("p")
		subElement.id = "COUNT"
		element.appendChild(subElement)
		return element
	},

	notificationReceived: function(notification, payload, sender) {
		switch(notification) {
			case "DOM_OBJECTS_CREATED":
				//var timer = setInterval(()=>{
				//	this.sendSocketNotification("DO_YOUR_JOB", this.count)
				//	this.count++
				//}, 1000)
				Log.log(this.name + " received a system notification: " + notification);
				this.sendSocketNotification("INIT", this.config)
				break
			case "CLOSE_PYTHON":
				Log.log(this.name + " received a system notification: " + notification)
				this.sendSocketNotification("QUIT", this.config)
				break
		}
	},

	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
		switch(notification) {
			case "USER_PRESENCE":
				this.sendNotification(notification, payload)
				Log.log(this.name + " received a system notification: " + notification + " payload = " + payload);
				if (payload === false){
					Log.log(this.name + " received a system notification: " + notification + " payload = " + payload);
					this.playVideo();
				}
				break
			case "PAUSE_VIDEO":
				Log.log(this.name + " received a system notification: " + notification + " payload = " + payload);
				//this.pauseVideo();
			case "I_DID":
				Log.log(this.name + " received a system notification: " + notification + " payload = " + payload)
				var elem = document.getElementById("COUNT")
				elem.innerHTML = "Count:" + payload
				break
			case "QUIT":
				Log.log(this.name + " quitte Python et change de page: " + notification + " payload = " + payload)
				this.sendNotification("PAGE_INCREMENT");
				break
		}
	},

	pauseVideo: function(){
		this.sendSocketNotification('VIDEO_PAUSED', this.config);
	},
	
	playVideo: function(){
		this.sendSocketNotification('VIDEO_CHANGED', this.config);
	},
})