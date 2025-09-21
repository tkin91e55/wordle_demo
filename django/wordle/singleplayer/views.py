from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt # csrf_exempt for testing purpose only

 # if max retry reached, need to start a new game,
 # and client needs to keep track of new game_id
MAX_ATTEMPT = 8
PREDEFINED_WORDS = ['REACT', 'HOOKS' ,'STATE','PROPS',
                    'REDUX', 'MODEL', 'VIEWS', 'ROUTE', 'ARRAY', 'DEBUG', 'QUERY'
                    'MONGO', 'NODES', 'STACKS', 'QUEUE', 'GRAPH', 'TREES']

def index(request):
    cxt = {"MAX_ATTEMPT":MAX_ATTEMPT}
    return render(request, 'singleplayer/index.html',cxt)

global_gid = 0 # game_id, each play session increase by 1
def _increment_gid():
    global global_gid
    global_gid += 1

# TODO after game logic correct, switch to use broswer cookie session, but no persistence layer
dict_game_ans = {} # no persistence layer, just for demo, keep game_id, ans, attempt

def _create_new_game():
    new_game_id = global_gid
    _increment_gid()
    from random import choice
    answer = choice(PREDEFINED_WORDS)
    print(f"new game {new_game_id} answer {answer}")
    dict_game_ans[new_game_id] = {"answer":answer,"attempt":0}
    return new_game_id

def check_answer(game_id,guess):
    answer = dict_game_ans[game_id]['answer']
    is_correct = True if guess == answer else False
    color_hl = [] # highlight color for client
    for ch_guess,ch_ans in zip(guess,answer):
        if ch_guess == ch_ans:
            color_hl.append('hit')
        else:
            if ch_guess in answer:
                color_hl.append('present')
            else:
                color_hl.append('miss')

    print(f"check {guess} against {answer}")
    if not is_correct:
        dict_game_ans[game_id]['attempt'] += 1
    return is_correct, color_hl

# TODO document the exhange format data
import json
@csrf_exempt
def submit_guess(request):
    body = json.loads(request.body)
    print(f"{body=}, {dict_game_ans=}")
    try:
        cli_gid = body.get('game_id',-1) # client game id

        if cli_gid == -1 or (cli_gid not in dict_game_ans):
            cli_gid = _create_new_game()

        if dict_game_ans[cli_gid]['attempt'] >= MAX_ATTEMPT:
            return JsonResponse({"result":"error","message":"max attempt reached"})

        guess = str(body['guess']).upper()
        is_correct, colors = check_answer(cli_gid,guess)
        rep = {'game_id':cli_gid,'result':'ok','is_correct':is_correct,'colors':colors}
        return JsonResponse(rep)
    except Exception as e:
        print(f'error: {e}')
        return JsonResponse({"result":"error"})

