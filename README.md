# kekeke-cq-bot
sugar_bot &amp; cotton_bot on https://kekeke.cc/crusaders-quest

## Installation

Download required projects:
```
git clone https://github.com/dimotsai/kekeke
git clone https://github.com/dimotsai/kekeke-cq-bot
```

Setup local dependecies:
```
cd kekeke
npm link
```

Install packages:
```
cd kekeke-cq-bot
npm link kekeke
npm install
```

## Start a bot manually
Modify the config:
```
vim config/default.json
```
For example:
```
{
  "api": {
    "hostname": "localhost",
    "port": 30000
  },
  "bot": {
    "anonymousId": "ANONYMOUS_ID_FROM_KEKEKE_CC",
    "nickname": "sugar_bot",
    "topic": "crusaders-quest"
  },
  "logger": {
    "anonymousId": "ANONYMOUS_ID_FROM_KEKEKE_CC",
    "nickname": "cotton_bot",
    "topic": "crusaders-quest"
  },
  "mongodb": {
    "host": "localhost",
    "port": 27017,
    "dbname": "cq",
    "username": "DB_USERNAME",
    "password": "DB_PASSWORD"
  }
}
```
Note: You can find anonymousId in the local storage of kekeke.cc with the name `hiroba.anonymousId`.

To run a chat bot, you simply run:
```
npm run bot
```
Note: you may not have enough kerma to reply every message, try starting a bot for a couple of hours to accumulate kerma.

## Start a bot using `pm2`
Install `pm2`
```
npm install -g pm2
```

Use `pm2` to run a chat bot as a daemon
```
cd kekeke-bot
pm2 start src/bot.js --name "mybot"
```
