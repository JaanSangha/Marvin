# MarvinBot 🤖

A Twitter bot that generates and posts funny, relatable tweets using OpenAI's GPT-3.5-turbo. The bot runs automatically every 6 hours via GitHub Actions.

## Features

- 🤖 AI-powered tweet generation using OpenAI
- 🎯 22 different prompt categories for variety
- 🕐 Automated scheduling every 6 hours
- 🔒 Secure API key management
- 📝 Comprehensive logging and error handling

## Setup Instructions

### 1. Local Development

1. Clone the repository:

```bash
git clone <your-repo-url>
cd marvinbot
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Fill in your API keys in `.env`:

```env
TWITTER_APP_KEY=your_twitter_app_key
TWITTER_APP_SECRET=your_twitter_app_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret
OPENAI_API_KEY=your_openai_api_key
```

5. Test locally:

```bash
npm start
```

### 2. GitHub Hosting with GitHub Actions

#### Important Security Steps (CRITICAL!)

1. **NEVER commit your `.env` file** - it's already in `.gitignore`

2. **Set up GitHub Secrets** in your repository:

   - Go to your repo → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `TWITTER_APP_KEY`
     - `TWITTER_APP_SECRET`
     - `TWITTER_ACCESS_TOKEN`
     - `TWITTER_ACCESS_SECRET`
     - `OPENAI_API_KEY`

3. **Remove API keys from commit history** (if they were ever committed):

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch index.js" \
  --prune-empty --tag-name-filter cat -- --all
```

4. **Force push to clean history**:

```bash
git push origin --force --all
```

#### GitHub Actions Setup

The bot will automatically run every 6 hours via the GitHub Actions workflow in `.github/workflows/tweet-bot.yml`.

You can also manually trigger it:

- Go to Actions tab in your repo
- Select "MarvinBot Tweet Scheduler"
- Click "Run workflow"

## API Keys Required

### Twitter API

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Generate API keys and access tokens
4. Ensure your app has read and write permissions

### OpenAI API

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and add billing
3. Generate an API key

## How It Works

1. **Prompt Selection**: Randomly selects one of 22 different prompt categories
2. **AI Generation**: Uses OpenAI GPT-3.5-turbo to generate a funny, relatable tweet
3. **Twitter Posting**: Posts the generated content to Twitter
4. **Scheduling**: Runs automatically every 6 hours via GitHub Actions

## File Structure

```
marvinbot/
├── .github/workflows/
│   └── tweet-bot.yml          # GitHub Actions workflow
├── .env.example               # Example environment variables
├── .gitignore                 # Git ignore rules
├── index.js                   # Main bot logic
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Troubleshooting

### Common Issues

1. **"Missing required environment variable"**

   - Ensure all API keys are set in GitHub Secrets
   - Check that `.env` file exists locally with all keys

2. **Twitter API errors**

   - Verify your Twitter app has read/write permissions
   - Check that your API keys are correct
   - Ensure your Twitter account is not suspended

3. **OpenAI API errors**
   - Verify your API key is correct
   - Check your OpenAI account has sufficient credits
   - Ensure the API key has access to GPT-3.5-turbo

### Manual Testing

To test the bot manually:

```bash
npm start
```

### Viewing Logs

GitHub Actions logs are available in the Actions tab of your repository.

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC License
