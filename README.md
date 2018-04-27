# liri-node-app
LIRI (Language Interpretation and Recognition Interface) is a command line Node.js Application that takes in parameters (via command line arguments or file input) to display tweets, songs from Spotify, and movie information from OMDB.
## LIRI Commands
node ./liri [ my-tweets, spotify-this-song, movie-this, do-what-it-says ] '< song / movie name here >'
## Sample .env file [ REQUIRED ]
```
# Spotify API keys
SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

# Twitter API keys
TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

# OMDb API key
OMDB_API_KEY=your-omdb-api-key
```