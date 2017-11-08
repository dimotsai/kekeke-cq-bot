# kekeke-cq-bot
https://kekeke.cc/crusaders-quest 上的 sugar_bot &amp; cotton_bot 

## 前置作業
### Windows
請先安裝 node.js 和 git:
* https://nodejs.org/en/
* https://git-scm.com/

安裝完後，打開 `Node.js command prompt` 並跳到下個章節

### Linux
請安裝以下的套件：
* git
* nodejs

## 安裝
下載 kekeke-cq-bot：
```
git clone https://github.com/dimotsai/kekeke
git clone https://github.com/dimotsai/kekeke-cq-bot
```

設定依賴的本地套件：
```
cd kekeke
npm link
```

安裝其他套件：
```
cd kekeke-cq-bot
npm link kekeke
npm install
```

## Start a bot manually
修改 config/default.json，例如：
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
Note: anonymousId 可以在 kekeke.cc 的 local storage 裡面找到，名稱為 `hiroba.anonymousId`。這邊可以透過瀏覽器提供的開發者工具取得這個值。
這個值是 server 用來辨別匿名 kekeke 帳戶使用。

如果要啟動 bot，只需下底下命令：
```
npm run bot
```
Note: 一開始 Kerma 可能會不夠，掛著累積 Kerma 吧！

## 使用 `pm2` 來架 bot
安裝 `pm2`
```
npm install -g pm2
```

用 `pm2` 來啟動 bot 並在背景執行
```
cd kekeke-bot
pm2 start src/bot.js --name "mybot"
```
