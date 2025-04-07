const chalk = require('chalk');

module.exports = (m) => {
  let info = "";
  info += chalk.bgGreen(`${m.pushName}`) + chalk.white(' >>> ') + chalk.green(`${m.body.startsWith(m.body) ? m.body : m.body}\n`);
  info += chalk.white('>>> ') + chalk.green(`Message: ${m.isGroup ? "Group Chat" : "Private Chat"}\n`);
  if (m.isGroup) {
   info += chalk.white('>>> ') + chalk.green(`Subject: ${m.metadata.subject}\n`);
   info += chalk.white('>>> ') + chalk.green(`Type: ${m.type}\n`);
   info += chalk.white('>>> ') + chalk.green(`Sender: ${m.sender}\n`);
   info += chalk.white('>>> ') + chalk.green(`Number: ${m.sender.split('@')[0]}\n`);
  } else {
    info += chalk.white('>>> ') + chalk.green(`Sender: ${m.sender}\n`);
    info += chalk.white('>>> ') + chalk.green(`Number: ${m.sender.split('@')[0]}\n`);
  }
  console.log(info);
};
