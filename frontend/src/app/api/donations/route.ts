import { NextResponse } from 'next/server'
import { listDonations, createDonation } from '@/lib/services.server'
import type { DonationType } from '@/lib/api'

export function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const donationType = searchParams.get('donationType') as DonationType | null
    const causeId = searchParams.get('causeId') ?? undefined
    const uncategorisedOnly = searchParams.get('uncategorisedOnly') === 'true'
    return NextResponse.json(
      listDonations({ donationType: donationType ?? undefined, causeId, uncategorisedOnly })
    )
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const donation = createDonation(body)
    return NextResponse.json(donation, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 422 })
  }
}
