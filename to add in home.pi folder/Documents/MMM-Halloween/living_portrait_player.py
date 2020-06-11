#!/usr/bin/env python3
#Created by scarethetots
from gpiozero import MotionSensor
import sys
from omxplayer.player import OMXPlayer
from pathlib import Path
from time import sleep

#files = sys.argv[1]
slength = '1680'
swidth = '1050' #'1680'
print("Starting up....")
tgr = 0

p = Path('/home/pi/Videos/UP - Living Nightmare - Little Girl/TV - No Frame - Vertical')
#p = Path('/home/pi/Videos/UP - Living Nightmare - Little Girl/TV - Framed - Vertical')
files = list(p.glob('**/*.mp4'))

# getting length of list 
length = len(files)
try:
    for i in range(length):
        VIDEO_PATH = Path(files[2])
        #VIDEO_PATH = Path("Videos/UP - Living Nightmare - Little Girl/TV - No Frame - Horizontal/UP_Girl_Buffer_TV_H.mp4")
        player = OMXPlayer(VIDEO_PATH,  args=['--orientation','180','--no-osd', '--loop','--win', '0 0 {0} {1}'.format(slength, swidth)]) #'--orientation','--aspect-mode', 90 stretch
        #omxplayer  --orientation 180 Videos/UP\ -\ Living\ Nightmare\ -\ Little\ Girl/TV\ -\ No\ Frame\ -\ Vertical/UP_Girl_EyesOnYou_TV_V.mp4
        pir = MotionSensor(17)
        sleep(1)
        print("Ready to trigger")
        while True:
            player.pause()
            if pir.motion_detected:
                print("trigger count {}".format(tgr))
                player.play()
                sleep(player.duration())
                tgr = tgr + 1
            else:
                pass
            player.set_position(0.0)


except KeyboardInterrupt:
    player.quit()
    sleep(3)
    sys.exit()