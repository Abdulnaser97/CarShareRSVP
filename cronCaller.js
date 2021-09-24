#! /usr/local/bin node

const util = require("util");
const exec = util.promisify(require("child_process").exec);

// Specify script to run cron scheduler as well as its contaning folder path
const REPO_PATH = "/Users/naser/Desktop/Projects/CarShareRSVP";
const SCRIPT = "CarBookerCLI";

async function cronCaller(command) {
  var bookingTime;
  var amenityType;
  var profile;
  process.argv.forEach((val, index) => {
    if (val.includes("hr=")) {
      bookingTime = val.substr("hr=".length + 2);
    } else if (val.includes("amenityType=")) {
      amenityType = val.substr("amenityType=".length + 2);
    } else if (val.includes("profile=")) {
      profile = val.substr("profile=".length + 2);
    }
  });

  let cmd = command;

  console.log(cmd);

  const { stdout, stderr } = await exec(
    `(crontab -l 2>/dev/null; echo "${cmd}") | crontab -`
  );
  console.log(stdout);
  console.log(stderr);
}

const cmd1 = `00 00 * * 4 cd ${REPO_PATH} && /usr/local/bin/node CarBookerCLI --startHr=10 --startMin=00 --endHr=20 --endMin=00 >/tmp/cronLogs${SCRIPT}.log 2>/tmp/cronErrLogs${SCRIPT}.log`;
const cmd2 = `00 00 * * 5 cd ${REPO_PATH} && /usr/local/bin/node CarBookerCLI --startHr=10 --startMin=00 --endHr=20 --endMin=00 >/tmp/cronLogs${SCRIPT}.log 2>/tmp/cronErrLogs${SCRIPT}.log`;

cronCaller(cmd1);
//cronCaller(cmd2);
