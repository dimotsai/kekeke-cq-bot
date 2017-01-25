module.exports = bot => {
  const tag = `@${bot.getNickName()}`;
  const helpMessage = '你好，我是 CQ 機器人 (relax) ，我可以：' +
    `「${tag} 被動 <角色名稱> - 角色被動」(end)` +
    `「${tag} 圖片 <角色名稱> - 角色圖」` +
    `「${tag} <算式> - 計算機」(end)` +
    `「${tag} 專武 <角色名稱> - 專武被動」` +
    `「${tag} 分析 <角色名稱> - 分析角色」`;

  bot.respond(/^(求助|說明|help)/i, res => {
    res.reply(helpMessage);
  });

  bot.respond(/^(安安|早安|午安|晚安|日安|早上好|晚上好|hi|hello)/i, res => {
    res.reply(`${res.match[1]} (hug)`);
  });

  bot.hear(/^(安安|早安|午安|晚安|日安|早上好|晚上好|hi|hello)/i, res => {
    res.reply(`${res.match[1]} (hug)`);
  });

  bot.respond(/^你是誰/, res => {
    res.reply('我是初號機。');
  });

  bot.hear(/^有人在?嗎/, res => {
    res.reply(`我 (grin)`);
  });

  bot.hear(/^(先去?睡了?|來去?睡|去睡了?|睡覺去?|我?要睡了?)/i, res => {
    res.reply('祝好夢 (sleep)');
  });

  bot.hear(/^(掰掰?|再見|待會見|bye)/i, res => {
    res.reply('慢走 (paper)');
  });
};

