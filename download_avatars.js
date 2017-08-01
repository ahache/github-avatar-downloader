var input = process.argv.slice(2);
if (input.length !== 2) {
  throw 'Usage: download_avatars.js <owner> <repo>';
}

require('dotenv').config();
var request = require('request');
var fs = require('fs');

var envFile = ".env";
if (!fs.existsSync(envFile)) {
  throw ".env file does not exist";
}

var store = "avatars/";
if (!fs.existsSync(store)) {
  throw "avatars directory does not exist";
}

if (!process.env.GITHUB_USER || !process.env.GITHUB_TOKEN) {
  throw "Missing environment variables";
}

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = "https://" + process.env.GITHUB_USER + ":" + process.env.GITHUB_TOKEN + "@api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  }
  request(options, function (err, response, body) {
    if (response.statusCode === 401) {
      throw "Improper credentials";
    }
    if (response.statusCode !== 200) {
      console.log("Repository does not exist, check input");
      return false;
    }
    var contributors = JSON.parse(body);
    cb(err, contributors);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
      console.log("ERROR: ", err);
    })
    .pipe(fs.createWriteStream(filePath))
    .on('finish', function () {
      console.log("Image Downloaded");
    });
}

getRepoContributors(input[0], input[1], function(err, result) {
  if (err) {
    console.log("Errors:", err);
    return false;
  }
  result.forEach(function (user) {
    downloadImageByURL(user.avatar_url, store + user.login);
  });
});