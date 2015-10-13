import alsaaudio, time, audioop
import requests
import random
import math
def req(x, v):
    url = 'http://192.168.1.99:1338?x=' + x + '&volume=' + v + '&mode=volume'
    try:
        requests.get(url, timeout=0.1)
    except requests.exceptions.Timeout:
        pass


def translate(x, y):
    return (y * 60 ) + x 

inp = alsaaudio.PCM(alsaaudio.PCM_CAPTURE,alsaaudio.PCM_NONBLOCK)
inp.setchannels(1)
inp.setrate(8000)
inp.setformat(alsaaudio.PCM_FORMAT_S16_LE)
inp.setperiodsize(160)


while True:
    # Read data from device
    l,data = inp.read()
    if l:
        v = math.floor(audioop.max(data, 2)/100)
        if v > 5:
            x = random.randint(1, 60)
            y = random.randint(1, 48)
            print(x, y, v)
            req(str(translate(x,y)), str(v))
        time.sleep(.001)
