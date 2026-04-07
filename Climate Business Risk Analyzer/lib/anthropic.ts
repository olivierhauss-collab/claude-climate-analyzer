import Anthropic from '@anthropic-ai/sdk'
import { analysisResponseSchema, type AnalyzeInput, type AnalysisResponse } from './schemas'
import { buildSystemPrompt, buildUserMessage } from './prompt'

// ---------------------------------------------------------------------------
// SERVER-ONLY — The ANTHROPIC_API_KEY must never be exposed to the browser.
// ---------------------------------------------------------------------------

export const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514'
export const ANTHROPIC_MAX_TOKENS = 4096
export const ANTHROPIC_TEMPERATURE = 0.3

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Extract text content from a Claude API response.
 */
function extractText(response: Anthropic.Message): string {
  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in API response')
  }
  return textBlock.text
}

/**
 * Parse and validate the LLM's JSON response against the Zod schema.
 * Handles cases where the model wraps JSON in markdown fences.
 */
function parseResponse(rawText: string): AnalysisResponse {
  // Strip markdown code fences if present
  let cleaned = rawText.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }

  const parsed: unknown = JSON.parse(cleaned)
  return analysisResponseSchema.parse(parsed)
}

/**
 * Call the Anthropic API to generate a climate risk analysis.
 *
 * - Builds the system prompt (with climate reference data) and user message.
 * - Calls Claude with temperature=0.3 for high factual consistency.
 * - Validates the response against the Zod schema.
 * - On parse failure: retries ONCE. On second failure: throws.
 * - NEVER streams — waits for full completion.
 */
export async function callAnthropic(input: AnalyzeInput): Promise<AnalysisResponse> {
  const systemPrompt = buildSystemPrompt()
  const userMessage = buildUserMessage(input)

  let lastError: Error | null = null

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: ANTHROPIC_MAX_TOKENS,
        temperature: ANTHROPIC_TEMPERATURE,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      })

      // Check for refusal
      if (response.stop_reason === 'end_turn' && response.content.length === 0) {
        throw new Error('API returned empty content')
      }

      const rawText = extractText(response)
      return parseResponse(rawText)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Only retry on parse/validation errors, not on API errors
      if (error instanceof Anthropic.APIError) {
        throw error
      }

      // If first attempt failed, retry
      if (attempt === 0) {
        continue
      }
    }
  }

  throw lastError ?? new Error('Failed to generate analysis')
}
