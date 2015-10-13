import alsaaudio, time, audioop
import requests
import random
import math
def req(x, y, v):
    x = (y * 60) + x
    url = 'http://192.168.1.99:1338?x=' + x + '&y=' + y + '&volume=' + v + '&mode=volume'
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
        v = str(math.floor(audioop.max(data, 2)/70))
        if v > 3:
            x = str(random.randint(1, 20))
            y = str(random.randint(1, 20))
            print(x, y, v)
            req(x, y, v)
        time.sleep(.005)