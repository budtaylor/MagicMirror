#!/usr/bin/python
import os
from time import sleep
import RPi.GPIO as GPIO
import subprocess
GPIO.setmode(GPIO.BCM)

# setup our input pin
# we use an internal pull up resistor to hold the pin at 3v3, otherwise the inputs value could chatter between high and low

GPIO.setup(21, GPIO.IN, pull_up_down=GPIO.PUD_UP)

while True:
    if ( GPIO.input(21) == False ):
        print("Button Pressed")
        subprocess.call(" python3 /home/pi/living_portrait_player.py 1", shell=True)
        #os.system('date') # print the systems date and time
        print GPIO.input(21)
        sleep(5)
    else:
        os.system('clear') # clear the screens text
        print ("Waiting for you to press a button")
        print(output)
        sleep(0.1)