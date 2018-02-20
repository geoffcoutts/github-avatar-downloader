# GitHub Avatar Downloader

## Problem Statement

Given a GitHub repository name and owner, download all the contributors' profile images and save them to a subdirectory, `avatars/`.

## Expected Usage

This program should be executed from the command line, in the following manner:

`node download_avatars.js jquery jquery`

## Setup

Create a .env file in the same directory. Your github authentication key will be placed in here. Use the following format (case sensitive):

DB_HOST=localhost
DB_USER=root
DB_PASS=**github token**