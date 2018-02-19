var request = require('request');
var token = require('./secrets.js');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'user-Agent': 'request',
      'Authorization': token
    }
  };

    request(options, function(err, res, body) {
      var data = JSON.parse(body);
      cb(err, data);
    });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  for (i = 0; i < result.length; i++) {
    console.log(result[i].avatar_url);
  }
});

function downloadImageByURL (url, filePath) {
  request.get(url)
         .on('error', function (err) {
            throw err;
         })
         .pipe(fs.createWriteStream(filePath));
}

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");