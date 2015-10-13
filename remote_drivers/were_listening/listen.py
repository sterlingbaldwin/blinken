import alsaaudio, time, audioop
import requests
import random

def req(x, y, v):
	url = 'http://192.168.1.99:1338?x=' + x + '&y=' + y + '&volume=' + v
	requests.get(url)

inp = alsaaudio.PCM(alsaaudio.PCM_CAPTURE,alsaaudio.PCM_NONBLOCK)
inp.setchannels(1)
inp.setrate(8000)
inp.setformat(alsaaudio.PCM_FORMAT_S16_LE)
inp.setperiodsize(160)


while True:
    # Read data from device
    l,data = inp.read()
    if l:
        # Return the maximum of the absolute value of all samples in a fragment.
        x = random.randInt(1, 60)
        y = random.randInt(1, 48)
        v = audioop.max(data, 2)/100)
		print x, y, v
        req(x, y, v
    	time.sleep(.005)