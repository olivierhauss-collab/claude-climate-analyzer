import { NextResponse } from 'next/server'

// Proxies company autocomplete queries to:
//   - recherche-entreprises.api.gouv.fr for ?country=FR (free, unlimited)
//   - OpenCorporates for international (free tier, 500 req/month)
// Adds Cache-Control: public, max-age=300 to reduce upstream calls.

export async function GET(_req: Request): Promise<NextResponse> {
  // TODO: Extract `q` and `country` params from _req.url
  // TODO: Route to appropriate upstream API based on country
  // TODO: Normalize results to { name: string, siret?: string, address?: string }[]
  // TODO: Return with Cache-Control header
  return NextResponse.json([], {
    headers: { 'Cache-Control': 'public, max-age=300' },
  })
}
