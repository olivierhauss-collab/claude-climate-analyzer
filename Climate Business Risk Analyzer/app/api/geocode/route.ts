import { NextResponse } from 'next/server'

// Proxies geocoding autocomplete queries to Photon (Komoot / OpenStreetMap).
// Returns normalized location objects for the LocationInput component.
// Adds Cache-Control: public, max-age=300.
// OpenStreetMap attribution must be displayed in the app footer.

export async function GET(_req: Request): Promise<NextResponse> {
  // TODO: Extract `q` param from _req.url
  // TODO: Fetch https://photon.komoot.io/api/?q={q}&limit=5
  // TODO: Normalize to { display_name, lat, lon, scope: 'city' | 'region' | 'country' | 'global' }[]
  // TODO: Return with Cache-Control header
  return NextResponse.json([], {
    headers: { 'Cache-Control': 'public, max-age=300' },
  })
}
