import { NextResponse } from 'next/server'

interface GeoResult {
  display_name: string
  lat: number
  lon: number
  scope: 'city' | 'region' | 'country' | 'global'
}

const WORLDWIDE_OPTION: GeoResult = {
  display_name: 'Worldwide',
  lat: 0,
  lon: 0,
  scope: 'global',
}

/**
 * GET /api/geocode?q=...
 *
 * Proxies geocoding autocomplete queries to Photon (Komoot / OpenStreetMap).
 * Returns normalized location objects for the LocationInput component.
 * Always includes "Worldwide" as the first option.
 *
 * On upstream failure: returns just ["Worldwide"] (graceful degradation).
 */
export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')?.trim()

  if (!query || query.length < 2) {
    return NextResponse.json([WORLDWIDE_OPTION], {
      headers: { 'Cache-Control': 'public, max-age=300' },
    })
  }

  try {
    const url = new URL('https://photon.komoot.io/api/')
    url.searchParams.set('q', query)
    url.searchParams.set('limit', '5')

    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      return NextResponse.json([WORLDWIDE_OPTION], {
        headers: { 'Cache-Control': 'public, max-age=60' },
      })
    }

    const data = await res.json() as {
      features?: Array<{
        geometry?: { coordinates?: [number, number] }
        properties?: {
          name?: string
          city?: string
          state?: string
          country?: string
          type?: string
        }
      }>
    }

    const results: GeoResult[] = [WORLDWIDE_OPTION]

    for (const feature of data.features ?? []) {
      const coords = feature.geometry?.coordinates
      const props = feature.properties
      if (!coords || !props) continue

      const displayParts: string[] = []
      if (props.name) displayParts.push(props.name)
      if (props.city && props.city !== props.name) displayParts.push(props.city)
      if (props.state) displayParts.push(props.state)
      if (props.country) displayParts.push(props.country)

      results.push({
        display_name: displayParts.join(', ') || 'Unknown location',
        lat: coords[1], // Photon returns [lon, lat]
        lon: coords[0],
        scope: mapScope(props.type),
      })
    }

    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    })
  } catch {
    return NextResponse.json([WORLDWIDE_OPTION], {
      headers: { 'Cache-Control': 'public, max-age=60' },
    })
  }
}

/** Map Photon's type to our geographic scope enum. */
function mapScope(type?: string): 'city' | 'region' | 'country' {
  switch (type) {
    case 'country':
      return 'country'
    case 'state':
    case 'district':
    case 'county':
      return 'region'
    default:
      return 'city'
  }
}
