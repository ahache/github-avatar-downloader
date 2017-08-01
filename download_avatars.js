var input = process.argv.slice(2);
if (input.length !== 2) {
  console.log("Usage: download_avatars.js <owner> <repo>");
  return false;
}

require('dotenv').config();
var request = require('request');
var fs = require('fs');

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
  if (err) console.log("Errors:", err);
  result.forEach(function (user) {
    downloadImageByURL(user.avatar_url, "avatars/" + user.login);
  });
});