// lib/profanity-filter.ts - Advanced profanity detection with moral guidance
import { Filter } from 'bad-words';

// Initialize the profanity filter
const filter = new Filter();

// Add additional custom words if needed (bad-words already has comprehensive list)
filter.addWords('dumb', 'stupid', 'idiot', 'moron', 'loser');

export interface ProfanityResult {
  isProfane: boolean;
  detectedWords: string[];
  severity: 'low' | 'medium' | 'high';
  warningMessage: string;
  moralQuote: string;
  fullResponse: string;
}

// Moral quotes for different severity levels
const MORAL_QUOTES = {
  low: [
    "💫 'Kind words can be short and easy to speak, but their echoes are truly endless.' - Mother Teresa",
    "🌟 'Be yourself; everyone else is already taken.' - Oscar Wilde",
    "✨ 'In a world where you can be anything, be kind.' - Jennifer Dukes Lee",
    "🌈 'The best way to find yourself is to lose yourself in the service of others.' - Gandhi",
    "💝 'Choose kindness and laugh often.' - Anonymous"
  ],
  medium: [
    "🙏 'Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.' - Martin Luther King Jr.",
    "🕊️ 'Be the change you wish to see in the world.' - Gandhi",
    "💎 'Your words have power. Use them wisely.' - Anonymous",
    "🌸 'Respect yourself and others will respect you.' - Confucius",
    "⭐ 'The way we talk to our children becomes their inner voice.' - Peggy O'Mara"
  ],
  high: [
    "🧘‍♂️ 'Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.' - Buddha",
    "🌅 'The greatest remedy for anger is delay.' - Thomas Paine",
    "🦋 'When we are no longer able to change a situation, we are challenged to change ourselves.' - Viktor Frankl",
    "🌺 'Peace cannot be kept by force; it can only be achieved by understanding.' - Albert Einstein",
    "🎯 'The best fighter is never angry.' - Lao Tzu"
  ]
};

// Warning messages for different severity levels
const WARNING_MESSAGES = {
  low: [
    "⚠️ Please keep our conversation respectful.",
    "🤝 Let's maintain a positive dialogue.",
    "💬 I'd appreciate more constructive language.",
    "✋ Let's redirect this conversation positively."
  ],
  medium: [
    "🚫 Profanity detected. Let's respect each other.",
    "⛔ I noticed inappropriate language. Let's keep it professional.",
    "🛑 Please use respectful language in our conversation.",
    "🔄 Let's restart with more appropriate communication."
  ],
  high: [
    "🚨 Strong profanity detected. Let's respect each other and communicate constructively.",
    "🛡️ Inappropriate content blocked. Please maintain respectful dialogue.",
    "⚡ Offensive language detected. Let's have a positive conversation instead.",
    "🔥 Let's cool down and communicate with respect and understanding."
  ]
};

/**
 * Detect profanity in text using bad-words library
 */
export function detectProfanity(text: string): ProfanityResult {
  const isProfane = filter.isProfane(text);
  
  // Extract detected words by checking each word individually
  const words = text.toLowerCase().split(/\s+/);
  const detectedWords: string[] = [];
  
  for (const word of words) {
    if (filter.isProfane(word)) {
      detectedWords.push(word);
    }
  }

  // Determine severity based on detected words
  let severity: 'low' | 'medium' | 'high' = 'low';
  if (detectedWords.some(word => 
    ['fuck', 'fucking', 'fucked', 'motherfucker', 'shit', 'bitch'].some(severe => 
      word.includes(severe)
    )
  )) {
    severity = 'high';
  } else if (detectedWords.length > 1) {
    severity = 'medium';
  }

  const randomQuote = getRandomMoralQuote(isProfane ? severity : 'low');
  const warningMessage = getRandomWarningMessage(isProfane ? severity : 'low');
  const fullResponse = isProfane ? `${warningMessage}\n\n${randomQuote}` : randomQuote;

  return {
    isProfane,
    detectedWords,
    severity,
    warningMessage,
    moralQuote: randomQuote,
    fullResponse
  };
}

/**
 * Get a random moral quote based on severity
 */
function getRandomMoralQuote(severity: 'low' | 'medium' | 'high'): string {
  const quotes = MORAL_QUOTES[severity];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

/**
 * Get a random warning message based on severity
 */
function getRandomWarningMessage(severity: 'low' | 'medium' | 'high'): string {
  const warnings = WARNING_MESSAGES[severity];
  return warnings[Math.floor(Math.random() * warnings.length)];
}

/**
 * Log profanity attempts for monitoring
 */
export function logProfanityAttempt(
  text: string, 
  detectedWords: string[], 
  severity: string, 
  ip?: string
): void {
  console.warn('🚫 Profanity detected:', {
    timestamp: new Date().toISOString(),
    ip: ip || 'unknown',
    severity,
    detectedWords: detectedWords.length,
    textLength: text.length,
    // Don't log the actual text for privacy
  });
}
