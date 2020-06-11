#!/usr/bin/env python3
import os
import glob
import sys
from time import sleep
import RPi.GPIO as GPIO
from gpiozero import MotionSensor
from omxplayer.player import OMXPlayer
from pathlib import Path

# setup our input pin
# we use an internal pull up resistor to hold the pin at 3v3, otherwise the inputs value could chatter between high and low
GPIO.setmode(GPIO.BCM)
GPIO.setup(21, GPIO.IN, pull_up_down=GPIO.PUD_UP)

slength = '1680'
swidth = '1050' #'1680'
#print("Starting up....")
#tgr = 0

file_path_halloween = '/home/pi/Videos/UP - Living Nightmare - Little Girl/TV - No Frame - Vertical/UP_Girl_EyesOnYou_TV_V_25fps.mp4' # Halloween
file_path_love = '/home/pi/Videos/Love and Hope Digital Decoration/Love_and_Hope_TV_Wall.mp4' # Love

### HERE CHANGE THE FILE TO BE USED ###
file_path_used = file_path_love

p = Path(file_path_used)

#p = Path('/home/pi/Videos/UP - Living Nightmare - Little Girl/TV - Framed - Vertical')
#files = list(p.glob('**/*.mp4'))

# getting length of list 
#length = len(files)
#print("length = {} "+format(length))
pir = MotionSensor(17)
def play_video():
    try:
        #for i in range(length):
            VIDEO_PATH = Path(p)
            #print(Path(files[i]))
            #VIDEO_PATH = Path("Videos/UP - Living Nightmare - Little Girl/UP_Girl_EyesOnYou_TV_V.mp4")
            player = OMXPlayer(VIDEO_PATH,  args=['--orientation','180','--no-osd', '--loop','--win', '0 0 {0} {1}'.format(slength, swidth)]) #'--orientation','--aspect-mode', 90 stretch
            #omxplayer  --orientation 180 Videos/UP\ -\ Living\ Nightmare\ -\ Little\ Girl/TV\ -\ No\ Frame\ -\ Vertical/UP_Girl_EyesOnYou_TV_V.mp4
            #pir = MotionSensor(17)
            #sleep(1)
            #print("Ready to trigger")
            while True:
                player.pause()
                if pir.motion_detected:
                    #print("trigger count {}".format(tgr))
                    player.play()
                    if (file_path_used == file_path_love):
                        sleep(28.0)
                    else:
                        sleep(player.duration())
                    #tgr = tgr + 1
                else:
                    pass
                player.set_position(0.0)

                if ( GPIO.input(21) == True ):
                    player.quit()
                    if (os.path.exists("/tmp/omxplayerdbus.pi") or os.path.exists("/tmp/omxplayerdbus.root")):
                        #print("omxplayerdbus.pi exists")
                        filelist=glob.glob("/tmp/omxplayerdbus*")
                        for file in filelist:
                            os.remove(file)
                    #else:
                       #print("omxplayerdbus.pi does NOT exist")
                    #os.system('killall omxplayer.bin')
                    sleep(3)
                    break
                    #sys.exit()
            sleep(5)
    except KeyboardInterrupt:
        player.quit()
        sleep(3)

while True:
    if ( GPIO.input(21) == False ):
        #print("Button Pressed")
        #os.system('date') # print the systems date and time
        #print GPIO.input(21)
        #GPIO.setup(21,GPIO.OUT)
        #GPIO.output(21,1)
        play_video()
    else:
        #os.system('clear') # clear the screens text
        #print ("Waiting for you to press a button")
        sleep(0.1)


        #sys.exit()