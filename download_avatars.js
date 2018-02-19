var request = require('request');
var token = require('./secrets.js');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  // if (process.argv[2] || process.argv[3] === "") {
  //   return console.log('Please try again and enter a valid repo owner and name');
  // }
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

var input = process.argv.slice(2,4);

getRepoContributors(input[0], input[1], function(err, result) {
  // loop through avatar results and pull the avatar_url to download
  console.log(input[1]);
  fs.existsSync(`${input[1]}-avatars`) || fs.mkdirSync(`${input[1]}-avatars`);
  for (i = 0; i < result.length; i++) {
    console.log("Downloading: ", result[i].avatar_url);
    // Download avatars and save to folder with the name of the repository
    downloadImageByURL(result[i].avatar_url, `${input[1]}-avatars/${result[i].login}.jpg`);
    console.log("Finished downloading.");
  }
});

function downloadImageByURL (url, filePath) {
  request.get(url)
         .on('error', function (err) {
            throw err;
         })
         .pipe(fs.createWriteStream(filePath));
}
