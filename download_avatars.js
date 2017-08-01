var request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

var GITHUB_USER = "ahache";
var GITHUB_TOKEN = "26a33da516f7404f2a2349eaccfedbc7abb795cc";

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = "https://" + GITHUB_USER + ":" + GITHUB_TOKEN + "@api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
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

getRepoContributors("jquery", "jquery", function(err, result) {
  if (err) console.log("Errors:", err);
  result.forEach(function (user) {
    console.log(user.avatar_url);
  });
});
