import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt # csrf_exempt for testing purpose only
from django.http import HttpResponse
from .wordle_base import GameRoom, GLOBAL_ROOM_HANDLER

static_game = GameRoom() # for version 1
static_game.room_id = 'abcdef'
static_game.players = ['123456','234567']
static_game.state = GameRoom.STATE.PLAYING
GLOBAL_ROOM_HANDLER[static_game.room_id] = static_game

# start with a static game room first
def index(request):
    return HttpResponse(b"hi")

def visit(request,room_size=2):
    return HttpResponse(b"hi")

# get method
def poll(request,room_id):
    # require player token
    print(f'{request.GET=}, {room_id=}')
    try:
        room = GLOBAL_ROOM_HANDLER[room_id]
        player_token = request.GET.get('player','')
        poll_res = room.poll(player_token)
        poll_res['result'] = 'ok'
        return JsonResponse(poll_res)
    except Exception as err:
        print(f'err {err}')
        return JsonResponse({'result':'not allowed game rule'})

# post method
@csrf_exempt
def submit(request):
    body = json.loads(request.body.decode())
    body['player_token'] = body['token']
    print(f'{body=}')
    try:
        room = GLOBAL_ROOM_HANDLER[body['room_id']]
        submit_res = room.submit_(**body)
        submit_res['result'] = 'ok'
        return JsonResponse(submit_res)
    except Exception as err:
        print(f'err {err}')
        return JsonResponse({'result':'not allowed game rule'})

