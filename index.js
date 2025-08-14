import { TwitterApi } from "twitter-api-v2";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const tweetCategories = [
    "everyday life frustrations and relatable moments",
    "tech and social media absurdity",
    "work and office humor",
    "relationships and social awkwardness", 
    "current events and pop culture",
    "space, science, and tech humor",
    "food and cooking disasters",
    "transportation and travel mishaps",
    "pet and animal antics",
    "shopping and consumer culture",
    "health and fitness struggles",
    "entertainment and media commentary"
];

async function generateTweet(maxRetries = 3, retryDelay = 5000) {
    let attempt = 0;
    
    while (attempt < maxRetries) {
        try {
            attempt++;
            console.log(`🤖 MarvinBot starting... (attempt ${attempt}/${maxRetries})`);
            
            // Validate environment variables
            const requiredEnvVars = [
                'TWITTER_APP_KEY',
                'TWITTER_APP_SECRET', 
                'TWITTER_ACCESS_TOKEN',
                'TWITTER_ACCESS_SECRET',
                'OPENAI_API_KEY'
            ];
            
            for (const envVar of requiredEnvVars) {
                if (!process.env[envVar]) {
                    throw new Error(`Missing required environment variable: ${envVar}`);
                }
            }

            // Initialize Twitter client
            const client = new TwitterApi({
                appKey: process.env.TWITTER_APP_KEY,
                appSecret: process.env.TWITTER_APP_SECRET,
                accessToken: process.env.TWITTER_ACCESS_TOKEN,
                accessSecret: process.env.TWITTER_ACCESS_SECRET,
            });

            // Initialize OpenAI client
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            // Select random category
            const randomNum = Math.floor(Math.random() * tweetCategories.length);
            const selectedCategory = tweetCategories[randomNum];
            
            console.log(`📝 Using category ${randomNum + 1}: ${selectedCategory}`);

            // Generate tweet content using OpenAI
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a hilarious, witty Twitter personality who creates viral-worthy tweets. You're known for being clever, relatable, and making people laugh out loud. When given a topic category, create a tweet that's so good people want to retweet it immediately. Be creative, unexpected, and genuinely funny - not just mildly amusing. Use specific details, clever wordplay, or unexpected angles. Keep it under 26 words, casual tone, NO hashtags or emojis. Make people think 'omg this is genius' or 'I'm literally crying laughing.'"
                    },
                    {
                        role: "user",
                        content: `Generate a humorous tweet about: ${selectedCategory}`
                    }
                ],
                max_tokens: 80,
                temperature: 1.1
            });

            const tweetContent = completion.choices[0].message.content;
            console.log(`✨ Generated tweet: ${tweetContent}`);

            // Post tweet
            const tweet = await client.v2.tweet(tweetContent);
            console.log(`🐦 Tweet posted successfully! Tweet ID: ${tweet.data.id}`);
            
            return { success: true, tweetId: tweet.data.id, content: tweetContent };
            
        } catch (error) {
            console.error(`❌ Error on attempt ${attempt}/${maxRetries}:`, error.message);
            
            // Check if this is a retryable error
            if (isRetryableError(error) && attempt < maxRetries) {
                console.log(`⏳ Waiting ${retryDelay/1000} seconds before retry...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                
                // Increase delay for next retry (exponential backoff)
                retryDelay *= 2;
                continue;
            }
            
            // If we've exhausted retries or it's a non-retryable error, throw
            throw error;
        }
    }
    
    throw new Error(`Failed after ${maxRetries} attempts`);
}

// Helper function to determine if an error is retryable
function isRetryableError(error) {
    const retryableErrors = [
        'ECONNRESET',
        'ETIMEDOUT',
        'ENOTFOUND',
        'ECONNREFUSED',
        'rate_limit_exceeded',
        'server_error',
        'temporary_error'
    ];
    
    // Check error message for retryable patterns
    const errorMessage = error.message.toLowerCase();
    return retryableErrors.some(retryableError => 
        errorMessage.includes(retryableError.toLowerCase())
    );
}

// Run the bot if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    generateTweet()
        .then(result => {
            console.log("✅ MarvinBot completed successfully!");
            process.exit(0);
        })
        .catch(error => {
            console.error("💥 MarvinBot failed:", error.message);
            process.exit(1);
        });
}

export { generateTweet };