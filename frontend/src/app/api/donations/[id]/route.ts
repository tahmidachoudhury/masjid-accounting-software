import { NextResponse } from 'next/server'
import { reclassifyDonation } from '@/lib/services.server'
import type { DonationType } from '@/lib/api'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const donation = reclassifyDonation(id, body.donationType as DonationType)
    return NextResponse.json(donation)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 422 })
  }
}
