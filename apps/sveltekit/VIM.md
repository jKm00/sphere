# VIM Basics

## Modes

- esc/ctrl + {/ctrl + c -> Normal Mode
- a/i -> Insert Mode
- v -> Visual Mode
- shift + v -> Visual Line Mode
- : -> Command Mode

## Binds

| Key      | Mode    | Description   |
| -------- | ------- | ------------- |
| j        | Normal  | Go down       |
| k        | Normal  | Go up         |
| h        | Normal  | Go right      |
| l        | Normal  | Go left       |
| w        | Normal  | Next word     |
| b        | Normal  | Previous word |
| dd       | Normal  | Delete line   |
| u        | Normal  | Undo          |
| ctrl + r | Normal  | Redo          |
| -        | -       | -             |
| y        | Visual  | Copy          |
| p        | Normal  | Paste         |
| -        | -       | -             |
| w        | Command | Save file     |
| q        | Command | Quit          |

## Combos

Command Count Motion

### Examples

| Combo | Description                      |
| ----- | -------------------------------- |
| 8k    | Move 8 lines up                  |
| d8k   | Delete current line + 8 lines up |
| y8k   | Copy current line + 8 lines up   |
