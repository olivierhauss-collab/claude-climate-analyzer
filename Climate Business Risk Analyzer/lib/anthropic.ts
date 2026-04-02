import Anthropic from '@anthropic-ai/sdk'
import type { AnalyzeInput, AnalysisResponse } from './schemas'

// SERVER-ONLY — never import this module from client components.
// The ANTHROPIC_API_KEY must never be exposed to the browser.

export const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514'
export const ANTHROPIC_MAX_TOKENS = 4096
export const ANTHROPIC_TEMPERATURE = 0.3

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// TODO: implement full logic:
//   1. Build messages array using buildSystemPrompt() + buildUserMessage() from ./prompt
//   2. Call client.messages.create() with ANTHROPIC_MODEL, ANTHROPIC_MAX_TOKENS, ANTHROPIC_TEMPERATURE
//   3. Extract text content from response
//   4. Parse as JSON and validate with analysisResponseSchema from ./schemas
//   5. On ZodError: retry once. On second failure: throw structured error.
//   6. Never stream — wait for full completion before returning.
export async function callAnthropic(_input: AnalyzeInput): Promise<AnalysisResponse> {
  void client // suppress unused warning until implementation
  throw new Error('TODO: callAnthropic not implemented')
}
