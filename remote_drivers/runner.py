import requests
import time
def req(x, y, rgb):
	url = 'http://192.168.1.99:1338?x=' + x + '&y=' + y + '&rgb=' + rgb
	requests.get(url)

if __name__=="__main__":
	rgb = '00ff00'
	for x in range(60):
		for y in range(48):
			req(str(x), str(y), rgb)
			print x, y
			time.sleep(0.5)
