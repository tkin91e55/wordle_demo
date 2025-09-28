# Task 4 logic

  Still no using cache and database.

## First version

  * only two players, can manually enter a room. Or assign and create room to players, for example
    game room full.
  * A static game room
  * client side:
    *  `is_your_turn` to control input
    *  `win_or_lose` to show end game result
    * polling to get game state every T seconds
  * server side:
    * consider to dispose stale games
    * keep players

## second version

  Let us define multi-player mode:
  * A variable number of players can join a game. A game only starts when the exact number of
    players have joined.
  * the server side will consider to assign/create a game room for new player.
  * player can enter a room through a room id


  * heartbeat: every player will send a heartbeat to server every 5 seconds, if no heartbeat
    received for 15 seconds, the player will be considered as offline and removed from the game.
    Use polling to implement heartbeat.
