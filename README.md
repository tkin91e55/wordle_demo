  This project consisted parts from I to IV.
  Django is for backend, React is for frontend.

  The purpose of this project is to deliver:

  1. Part 1: Normal wordle
  1. Part 2: Server/client Wordle
  1. Part 3: A variant of Wordle that starts with several correct answers.
  1. Part 4: Multi-player Wordle

# File Structure

  The project starts with some project toolings/templates for both Python Django and
  Javascript React.js

   Some of the key files listed as:

    ```
    ├── README.md
    ├── django
    │   ├── README.md
    │   ├── requirements.txt
    │   └── wordle
    │       ├── manage.py
    │       ├── singleplayer
    │       │   ├── static
    │       │   │   └── singleplayer
    │       │   │       ├── index-D1ZiPh2P.js  (built react code)
    │       │   │       └── index-D8b4DHJx.css (built react style)
    │       │   ├── templates
    │       │   │   └── singleplayer
    │       │   │       └── index.html
    │       │   └── views.py  ( The main logic of server side)
    │       └── wordle
    │           ├── settings.py
    │           └── urls.py
    └── react
        ├── index.html
        ├── package.json
        └── src
            └── App.jsx (The Part 2 modication is here)
    ```

# Installation and Boot up Part 2 demo

  The react code has been built into Django.

  REQUIREMENT: Prepare Python 3, pip

  In a shell,

  ```
  cd django                        # go to django folder
  python3 -m venv venv             # create a virtual environment
  source venv/bin/activate
  pip install -r requirements.txt  # install dependencies
  python wordle/manage.py runserver
  ```

  Then visit http://127.0.0.1:8000 to see the demo.

## Versioning

  For a large project, strict versioning and development environment control is important.
  Your node.js/python version maybe different from mine. I hope this will still work.

  There is no complicated dependencies for Part 1.

# Features

  * This task 2 is different from task 1. The answer is not generated in the client side.
    Client can only send a guess to the server, and the server will return `is_correct` and
    `colors` array and let the client to render the result. The game in client only ends when
    `is_correct` is true before the number of tries run out.
