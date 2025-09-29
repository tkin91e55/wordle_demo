# This is common logic for both single and multiplayer
# TODO The goal is to refactor the common logic to here, so both single and multiplayer can use it
from random import choice

RAIDX = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
GLOBAL_ROOM_HANDLER = dict()

def generate_random_token(existing_tokens:set,length=6):
    token = ''
    while len(set(token))<length or (token in existing_tokens):
        token = ''.join(choice(RAIDX) for _ in range(length))
    existing_tokens.add(token)
    return token

class Game:
    # TODO implement persistence logic, player login functions etc....
    MAX_ATTEMPT = 3
    PREDEFINED_WORDS = ['REACT', 'HOOKS' ,'STATE','PROPS', 'REDUX', 'MODEL',
                        'VIEWS', 'ROUTE', 'ARRAY', 'DEBUG', 'QUERY' 'MONGO',
                        'NODES', 'STACK', 'QUEUE', 'GRAPH', 'BYTES', 'RDBMS'
                        'DEVOP', 'BUILD', 'CLOUD' ]

    def __init__(self):
        self.round = 0
        self.answer = choice(Game.PREDEFINED_WORDS)
        self.bingo = False # whether someone has won
        print(f"new game answer {self.answer}")
        self.history = "" # encoded with guess:colors,guess2:colors2...

    def check_answer(self, guess)-> tuple|None:
        """
        return (if the guess is correct, highlight color list)
        """
        if self.is_over(): return None
        answer = self.answer
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
        self.history += f"{guess}:{''.join([c[0] for c in color_hl])},"

        if is_correct: self.bingo = True
        else:          self.round += 1

        return is_correct, color_hl

    def is_over(self):
        return self.round >= Game.MAX_ATTEMPT or self.bingo

from enum import Enum
class GameRoom:

    class STATE(Enum):
        WAITING = 0
        PLAYING = 1
        DISCONNECTED = 2
        FINISHED = 3

    def __init__(self, num_players=2):
        self.room_id = generate_random_token(set(GLOBAL_ROOM_HANDLER.keys()))
        # TODO consider to use http proxy for easier Dev Exp,
        # use brower cookie/session rather than
        # JS stored variable
        self.players = []
        self.state = GameRoom.STATE.WAITING
        self.num_players = num_players
        self._game = Game()
        self._winner = None
        self.polls = {}

    def join_room(self):
        rnd_token = generate_random_token(set(self.players))
        self.players.append(rnd_token)
        if len(self.players) == self.num_players:
            self.state = GameRoom.STATE.PLAYING
        _new_player_id = "{}-{}".format(self.room_id,rnd_token)
        return _new_player_id, self.state,

    def is_players_turn(self, player_token):
        r_round = self._game.round
        N,P = self.num_players, self.players
        is_your_round = ((r_round % N) == P.index(player_token))
        return is_your_round

    def poll(self,player_token)->dict|None:
        """
        If player_token is correct, return
        (game state, current round, is game over, is your round, winner)
        """
        if player_token not in self.players: return None
        r_state, r_over = self.state, self._game.is_over()
        r_history = self._game.history.strip(',')
        is_your_round = self.is_players_turn(player_token)
        r_state = r_state.name.lower()
        return dict(zip(
                   ("state", "is_over", "is_your_round", "history", "winner"),
                   (r_state, r_over, is_your_round, r_history, self._winner)))

    def submit_(self,guess,player_token,**kwargs)-> dict|None:
        if player_token not in self.players:       return None
        if not self.is_players_turn(player_token): return None
        check_result = self._game.check_answer(guess)
        if check_result is None: return None
        is_correct, colors = check_result
        if is_correct:
            self.state = GameRoom.STATE.FINISHED
            self._winner = player_token
        return dict(zip(('is_correct','colors'),(is_correct,colors)))

    def check_player_disconnected(self):
        # TODO do when being polled
        pass
