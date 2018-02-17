require("dotenv").config();
var keys = require('./keys.js');
var fs = require('fs');

var nodeArgs = process.argv;
var expr = nodeArgs[2];
var exprBase = expr;
var query = '';
var queryBase = '';
var result = '';
buildQuery();
callCommand(expr);

// Query Builder
function buildQuery() {
	for (var i = 3; i < nodeArgs.length; i++) {
		if (i > 3) {
			query += ' ' + nodeArgs[i];
		} else {
			query = nodeArgs[i];
	    }
	}
	queryBase = query;
}

// Commands available
function callCommand(expr) {
	switch (expr) {
		case 'my-tweets':
			getTweets();
			break;
		case 'spotify-this-song':
			getMusic();
			break;
		case 'movie-this':
			getMovie();
			break;
		case 'do-what-it-says':
			getRandom();
			break;
		default:
			console.log('commands: my-tweets, spotify-this-song, movie-this, do-what-it-says');
	}
}

// Application logging
function logging(result) {
	var usageLog = exprBase
	if (queryBase !== '') {
		usageLog += ',' + queryBase;
	}
	usageLog += "\n" + result
	fs.appendFile("log.txt", usageLog, function(err) {
		if (err) {
			return console.log(err);
		}
	});
}

// Twitter
function getTweets() {
	var Twitter = require('twitter');
	var client = new Twitter(keys.twitter);
	result = '';

	var params = { screen_name: 'dcyttw', count: 20 };
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for (var i = 0; i < tweets.length; i++) {
				result += tweets[i].text;
				result += "\nTweet Created: " + tweets[i].created_at;
				result += "\n------------------------------\n"
				console.log(result);
				logging(result);
			}
		} else {
			return console.log('Error occurred: ' + error);
		}
	});
}

// Spotify - 'All the Small Things'
function getMusic() {
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify(keys.spotify);
	result = '';

	if (query === '') {
		query = 'Ace of Base The Sign';
	}

	spotify.search({ type: 'track', query: query, limit: 1 }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		} else {
			var musicData = data.tracks.items[0]
			var artistName = musicData.album.artists[0].name;
			var songName = musicData.name;
			var songURL = musicData.album.artists[0].external_urls.spotify;
			var albumName = musicData.album.name;
			result += "Artist: " + artistName;
			result += "\nSong: " + songName;
			result += "\nURL: " + songURL;
			result += "\nAlbum: " + albumName;
			result += "\n------------------------------\n";
			console.log(result);
			logging(result);
		}
	});
}

// OMDb
function getMovie() {
	var request = require('request');
	var apikey = keys.omdb.key;
	result = '';

	if (query === '') {
		query = 'Mr. Nobody';
	}

	var queryOMDb = "http://www.omdbapi.com/?t=" + query + "&y=&plot=full&apikey=" + apikey;
	request(queryOMDb, function(error, response, body) {
		var movieData = JSON.parse(body);
		if (!error && response.statusCode === 200) {
			result += "Title: " + movieData.Title;
			result += "\nRelease Year: " + movieData.Year;
			result += "\nIMDB Rating: " + movieData.Ratings[0].Value;
			result += "\nRotten Tomatoes Rating: " + movieData.Ratings[1].Value;
			result += "\nCountry: " + movieData.Country;
			result += "\nLanguage: " + movieData.Language;
			result += "\nPlot: " + movieData.Plot;
			result += "\nActors: " + movieData.Actors;
			result += "\n------------------------------\n"
			console.log(result);
			logging(result);
		} else {
			return console.log('Error occurred: ' + error);
		}
	});
}

// Random
function getRandom() {
	var readline = require('readline');
	var lineArray = [];

	var rl = readline.createInterface({
		input: fs.createReadStream('random.txt'),
		crlfDelay: Infinity
	});

	rl.on('line', (line) => {
		lineArray.push(`${line}`);
	});

	rl.on('close', (input) => {
		var randomNumber = Math.floor(Math.random() * lineArray.length);
		var randomPick = lineArray[randomNumber].split(',');
		expr = randomPick[0];
		query = randomPick[1];
		callCommand(expr);
	});
}