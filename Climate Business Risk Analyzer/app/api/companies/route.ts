import { NextResponse } from 'next/server'

interface CompanyResult {
  name: string
  siret?: string
  address?: string
  country?: string
}

/**
 * GET /api/companies?q=...&country=...
 *
 * Proxies company autocomplete queries to:
 * - recherche-entreprises.api.gouv.fr for country=FR (free, unlimited)
 * - OpenCorporates for international queries (free tier)
 *
 * On upstream failure: returns empty array (graceful degradation).
 */
export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')?.trim()
  const country = searchParams.get('country')?.toUpperCase() ?? ''

  if (!query || query.length < 2) {
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'public, max-age=300' },
    })
  }

  try {
    let results: CompanyResult[]

    if (country === 'FR') {
      results = await searchFrench(query)
    } else {
      results = await searchInternational(query)
    }

    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    })
  } catch {
    // Graceful degradation — never show error to user for autocomplete
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'public, max-age=60' },
    })
  }
}

/** Search French companies via recherche-entreprises.api.gouv.fr */
async function searchFrench(query: string): Promise<CompanyResult[]> {
  const url = new URL('https://recherche-entreprises.api.gouv.fr/search')
  url.searchParams.set('q', query)
  url.searchParams.set('per_page', '5')
  url.searchParams.set('page', '1')

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  })

  if (!res.ok) return []

  const data = await res.json() as {
    results?: Array<{
      nom_complet?: string
      siren?: string
      siege?: { adresse?: string }
    }>
  }

  return (data.results ?? []).map((company) => ({
    name: company.nom_complet ?? '',
    siret: company.siren,
    address: company.siege?.adresse,
    country: 'FR',
  }))
}

/** Search international companies via OpenCorporates */
async function searchInternational(query: string): Promise<CompanyResult[]> {
  const url = new URL('https://api.opencorporates.com/v0.4/companies/search')
  url.searchParams.set('q', query)
  url.searchParams.set('per_page', '5')

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  })

  if (!res.ok) return []

  const data = await res.json() as {
    results?: {
      companies?: Array<{
        company?: {
          name?: string
          registered_address_in_full?: string
          jurisdiction_code?: string
        }
      }>
    }
  }

  return (data.results?.companies ?? []).map((item) => ({
    name: item.company?.name ?? '',
    address: item.company?.registered_address_in_full,
    country: item.company?.jurisdiction_code?.toUpperCase(),
  }))
}
