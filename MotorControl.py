#!/usr/bin/python

import Adafruit_BBIO.GPIO as GPIO
import Adafruit_BBIO.PWM as PWM
import time, atexit
from flask import Flask, render_template, request, jsonify, url_for
app = Flask(__name__)

#Setup GPIO Pins
GPIO.setup("P9_23", GPIO.OUT)
GPIO.setup("P9_25", GPIO.OUT)

#Start PWM with 0% duty cycle and 400Hz
PWM.start("P9_21", 0, 400)

#Initialize variables
green_state = 0
red_state = "Off"

@app.route("/")
def MainPage():
	templateData = {
		"green_state": green_state,
		"red_state": red_state,
	}
	return render_template("index.html", **templateData)

@app.route("/_set_green")
def SetGreen():
	global green_state
	green_request = request.args.get("green_pwm", 0, type=int)
	if green_request >= 0 and green_request <= 100:
		PWM.set_duty_cycle("P9_21", green_request)
		green_state = green_request
	print "Green State: " + str(green_state) + "%"
	return jsonify(result=green_state)

@app.route("/set_red/<red_request>")
def SetRed(red_request):
	global red_state
	if red_request == "On":
		GPIO.output("P9_25", GPIO.HIGH)
		red_state = "On"
	if red_request == "Off":
		GPIO.output("P9_25", GPIO.LOW)
		red_state = "Off"
	print "Red State is: " + red_state
	templateData = {
		"green_state": green_state,
		"red_state": red_state,
	}
	return render_template("index.html", **templateData)

#Executed at program shutdown
@atexit.register
def cleanup_pwm():
	PWM.stop("P9_21")
	PWM.cleanup()

if __name__ == "__main__":
		app.run(host="0.0.0.0",port=80,debug=True)