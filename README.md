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

    ```tree
    ├── README.md
    ├── django
    │   ├── poetry.lock
    │   └── pyproject.toml
    └── react
        ├── package.json
        └── src
            ├── App.jsx   (The Part 1 implementation)
            └── main.jsx
    ```

    `Poetry` is a more modern Python project management tool, similar to pip+virtualenv.
    And `npm` and `vite` is used for package management for React.js


# Installation and Boot up Part 1 demo

  Need to have node.js, npm.

  In a shell,

  ```
  cd react
  npm install # instlal the react, vite and other dependencies
  npm run dev
  ```

  Then visit http://127.0.0.1:5173 to see the demo.

## Versioning

  For a large project, strict versioning and development environment control is important.
  Your node.js/python version maybe different from mine. I hope this will still work.

  There is no complicated dependencies for Part 1.
