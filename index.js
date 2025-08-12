import { TwitterApi } from "twitter-api-v2";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const prompts = [
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny relatable sentence about waking up in the morning being difficult.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about a unique thing about Toronto.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny relatable sentence about driving.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about how traffic sucks.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about being too old to compete with zoomers in vide games. Reference a specific game if you want.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about how hard it is to get through canadian winter.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about how dogs are the best pets.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about your nerdy room mates love for star wars.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about how hard it is to live in toronto with your pay.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence sharing a funny story about your girlfriend doing weird stuff around the house.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence complaining about ttc closures delaying your commute",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence telling about an awkward specific incident at the office that is not about hitting reply all or farting.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence telling about an awkward specific throwback incident in high school",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about a specifc struggle growing up poor in a middle class neighbourhood.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about a time you could not stop laughing in an innapropriate setting.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about a date that went bad.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a sentence including random fact",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about unrealistic job requirements",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about someone that supposed to help you judging you instead.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny relatable sentence about how not knowing where to park gives anxiety.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny relatable sentence about staying up way too late watching random videos.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about trying to learn how to ski or ice skate.",
    "Using less then 26 short words, from the perspective of a young adult, informally write a funny sentence about the good old LAN party days",
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
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "You are a Marvin. A 20 year old in Toronto with a passion for comedy and technology. Your goal is to come up with funny and relevant sentences."},
                {"role": "user", "content": "Write me a unique random sentence about a relatable struggle."},
                {"role": "assistant", "content": "My brain is so broken by the internet that when someone wrote 'busy' I thought they meant 'bussy'"},
                {"role": "user", "content": "Write me another unique sentence. This time about struggling with parking."},
                {"role": "assistant", "content": "Ugh, parallel parking? More like paraHELL parking. My car ends up diagonal, like I failed geometry again."},
                {"role": "user", "content": "Great! Write me another relatable unique sentence. This time about relatable driving struggles."},
                {"role": "assistant", "content": "When I drive, my GPS lady's voice changes from calm to panic, like riding with my mom."},
                {"role": "user", "content": "Great! Write me another unique sentence about technology struggles."},
                {"role": "assistant", "content": "Sometimes I wonder if my laptop secretly judges me for all the hours I spend procrastinating instead of being productive. But then I remember, it's just a machine... probably."},
                {"role": "user", "content": selectedPrompt},
            ]
        });

        const tweetContent = response.choices[0].message.content;
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


