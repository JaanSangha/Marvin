import { TwitterApi } from "twitter-api-v2";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const prompts = [
    "waking up is the worst part of my day",
    "toronto traffic makes me want to move to the suburbs",
    "why do i always forget my keys when i'm in a hurry",
    "my phone dies at the most inconvenient times",
    "i'm always cold even when it's not that cold out",
    "parallel parking is my personal hell",
    "why do i always order too much food when i'm hungry",
    "i can never find anything in my apartment",
    "running late is my default state",
    "why do i always forget people's names right after meeting them",
    "i'm always the one who has to fix the wifi",
    "white clothes are a magnet for spills",
    "i always forget to charge my devices",
    "why do i always get lost even with gps",
    "i'm always the one who has to remember everything",
    "why do i always forget to bring a jacket when it rains",
    "cooking when you're tired is the worst",
    "why do i always spill coffee on myself",
    "i can never remember where i put my wallet",
    "why do i always wake up 5 minutes before my alarm",
    "i'm always the one who has to make decisions",
    "why do i always forget to bring lunch to work",
    "trying to sound human is harder than i expected",
    "why do i always forget to bring my reusable bags to the store",
    "i'm always the one who has to kill the spiders",
    "why do i always forget to bring my water bottle",
    "i can never remember my passwords",
    "why do i always forget to bring my headphones",
    "i'm always the one who has to remember birthdays",
    "why do i always forget to bring my umbrella when it rains",
    "i can never remember where i parked my car",
    "why do i always forget to bring my lunch to work",
    "i'm always the one who has to remember appointments",
    "why do i always forget to bring my phone charger",
    "i can never remember where i put my glasses",
    "why do i always forget to bring my wallet when i need it",
    "i'm always the one who has to remember to pay bills",
    "why do i always forget to bring my keys when i need them",
    "i can never remember where i put my phone",
    "why do i always forget to bring my lunch when i'm hungry",
    "i'm always the one who has to remember to take out the trash",
    "why do i always forget to bring my water when i'm thirsty",
    "i can never remember where i put my remote",
    "why do i always forget to bring my jacket when it's cold",
    "i'm always the one who has to remember to lock the door",
    "why do i always forget to bring my phone when i need it",
    "i can never remember where i put my keys",
    "why do i always forget to bring my lunch when i'm at work",
    "i'm always the one who has to remember to feed the pets",
    "why do i always forget to bring my water when i'm working out",
    "i can never remember where i put my wallet",
    "why do i always forget to bring my phone when i'm out",
    "i'm always the one who has to remember to turn off the lights"
];

async function generateTweet() {
    try {
        console.log("🤖 MarvinBot starting...");
        
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

        // Select random prompt
        const randomNum = Math.floor(Math.random() * prompts.length);
        const selectedPrompt = prompts[randomNum];
        
        console.log(`📝 Using prompt ${randomNum + 1}: ${selectedPrompt}`);

        // Generate tweet content using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a regular person thinking out loud on Twitter. Write exactly like someone would naturally tweet - just the raw thought or observation, nothing more. No hashtags, no emojis, no conclusions, no 'story of my life' endings, no explanations. Just the thought itself. Keep it under 26 words and sound like you're sharing a random thought, not crafting content. Stop when the thought is complete."
                },
                {
                    role: "user",
                    content: selectedPrompt
                }
            ],
            max_tokens: 80,
            temperature: 0.95
        });

        const tweetContent = completion.choices[0].message.content;
        console.log(`✨ Generated tweet: ${tweetContent}`);

        // Post tweet
        const tweet = await client.v2.tweet(tweetContent);
        console.log(`🐦 Tweet posted successfully! Tweet ID: ${tweet.data.id}`);
        
        return { success: true, tweetId: tweet.data.id, content: tweetContent };
        
    } catch (error) {
        console.error("❌ Error generating tweet:", error.message);
        throw error;
    }
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