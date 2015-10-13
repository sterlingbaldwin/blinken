import requests
import time
import sys
from Tkinter import *

def req(x, y, rgb):
	url = 'http://192.168.1.99:1338?x=' + x + '&y=' + y + '&rgb=' + rgb
	requests.get(url)

def leftKey(event):
    player_move = 'left'

def rightKey(event):
    player_move = 'right'

def quit(event):
	sys.exit()

def update():


paddle_size = 5
player_location = {
	'x': 27,
	'y': 0
}
player_move = ''
computer_location = {
	'x': 27,
	'y': 47
}
ball_position = {
	'x': 27,
	'y': 23
}
ball_velocity = {
	'x': 0,
	'y': 2
}


main = Tk()


frame = Frame(main, width=60, height=48)
main.bind('<Left>', leftKey)
main.bind('<Right>', rightKey)
main.bind('q', quit)
frame.pack()
main.mainloop()