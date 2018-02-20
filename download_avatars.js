/*
Given a repository owner and name
I can easily download all of the contributors avatars
So that I can use them on a website.
*/

var request = require('request');
var fs = require('fs');

// Create file in same directory called .env and list your github token as DB_PASS='token'.
require('dotenv').config();

var input = process.argv.slice(2,4);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  // Conditional if either field is not populated, then will not run the downloader.
  if (repoOwner === undefined || repoName === undefined || process.argv.length > 4) {
    return console.log('Please try again and enter only the repo owner and name with a space in between them.');
  }
  // Conditional if the the DB_PASS is missing or the .env file is missing, then will not run the downloader.
  if (process.env.DB_PASS === undefined) {
    return console.log(`Please check to make sure your .env file exists and has the proper information.`);
  }
  // url path to variable github repo contributors page.
  var options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${process.env.DB_PASS}`
    }
  };

  request(options, function(err, res, body) {
    // Handle status code errors and tell user what is wrong.
    if (res.statusCode === 401 || res.statusCode === 403) {
      return console.log(`Error: ${res.statusCode}, Authentication failed. Please verify your github authentication token in .env.`);
    } else if (res.statusCode === 404){
      return console.log(`Error: ${res.statusCode}, requested repo is not found. Please verify your inputs.`);
    }
    // parse JSON data to prepare to pull the avatar_url from each entry.
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
    console.log(`Downloading: ${result[i].avatar_url}`);
    // Download avatars and save to folder with the name of the repository.
    // Will ignore the avatar folder when pushing to github.
    downloadImageByURL(result[i].avatar_url, `${input[1]}-avatars/${result[i].login}.jpg`);
    console.log(`Finished downloading.`);
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
