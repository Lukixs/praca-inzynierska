# The Implementation of a Web Application to Play Dara

The purpose of the project was to create a web implementation of strategic game called Dara.

## Table of Contents

- [General Informations](#general-information)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Room for Improvement](#room-for-improvement)
- [Run Locally](#run-locally)

## General Information

The application will allow to play the game in three variants:

- local game (two players at one device), game with artificial intelligence and

- online game (two devices connected via internet connection). The main challenges during the production of this application is to create an artificial intelligence that allows to real-time competitive level gameplay,

- creating and maintaining a connection between two connection between two players who want to play matches over the Internet.

## Screenshots

![Main menu](/readMeImages/main_menu_screen.png)

![Local game menu](/readMeImages/local_game_menu_screen.png)

![AI game](/readMeImages/ai_game_screen.png)

![Online lobby](/readMeImages/online_lobby_screen.png)

![online game](/readMeImages/online_game_screen.png)

![Instructions](/readMeImages/instructions_screen.png)

## Features

- Player VS Player local game mode
- Player VS AI with three different difficulty levels game mode
- Player VS Player online game mode
- Player choose their names in online mode
- Chat box available in every online room
- Real-Time updated list of online rooms with their load shown

## Tech Stack

**Client:** Vue, TypeScript, Socket.IO, WebWorkers,

**Server:** Node, Socket.IO

## Room for Improvement

- Accounts,Rankings, and Progress badges
- MoveSet History
- Translations (i18n)
- Light/Dark theme toggle

## Run Locally

To aquire all functionalities of application you need to startup both front and backend parts of system.
But before you do that, you need to check some additional conditions.

### Requirements

- npm
- nodejs v15.X

### Frontend

Clone the project

```bash
  git clone https://github.com/Lukixs/praca-inzynierska
```

Go to the project directory

```bash
  cd praca-inzynierska
```

Install dependencies

```bash
  npm i
```

Start the server

```bash
  npm run serve
```

### Backend

Clone the project

```bash
  git clone https://github.com/Lukixs/praca-inzynierska-server
```

Go to the project directory

```bash
  cd praca-inzynierska-server
```

Install dependencies

```bash
  npm i
```

Start the server

```bash
  node .
```

## Contact

Created by Łukasz Zebzda

Contact: zeblukasz@gmail.com
