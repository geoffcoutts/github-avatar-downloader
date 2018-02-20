/*
Given a repository owner and name
I can easily download all of the contributors avatars
So that I can use them on a website.
*/

var request = require('request');
var fs = require('fs');

// Create file in same directory called secrets.js and export your GITHUB_TOKEN.
var token = require('./secrets.js');

var input = process.argv.slice(2,4);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  // Conditional if either field is not populated, then will not run the downloader.
  if (repoOwner === undefined || repoName === undefined) {
    return console.log('Please try again and enter both the repo owner and name');
  }
  // url path to variable github repo contributors page.
  var options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${token.GITHUB_TOKEN}`
    }
  };

  //parse JSON data to prepare to pull the avatar_url from each entry.
  request(options, function(err, res, body) {
    var data = JSON.parse(body);
    cb(err, data);
  });
}


getRepoContributors(input[0], input[1], function(err, result) {
  // Create a new folder for the given repository if it is not already made,
  // otherwise, sync to the folder that already exists.
  fs.existsSync(`${input[1]}-avatars`) || fs.mkdirSync(`${input[1]}-avatars`);

  // loop through avatar results and pull the avatar_url to download
  for (i = 0; i < result.length; i++) {
    console.log('Downloading: ', result[i].avatar_url);
    // Download avatars and save to folder with the name of the repository.
    // Will ignore the avatar folder when pushing to github.
    downloadImageByURL(result[i].avatar_url, `${input[1]}-avatars/${result[i].login}.jpg`);
    console.log('Finished downloading.');
  }
  // Reports total number of avatars downloaded.
  console.log(`Downloaded ${result.length} images.`);
});

function downloadImageByURL (url, filePath) {
  request.get(url)
         .on('error', function (err) {
            throw err;
         })
         .pipe(fs.createWriteStream(filePath));
}
