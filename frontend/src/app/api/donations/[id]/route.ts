import { NextResponse } from 'next/server'
import { reclassifyDonation } from '@/lib/services.server'
import { CLASSIFIABLE_TYPES } from '@/lib/fundConfig'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const donationType = CLASSIFIABLE_TYPES.find((type) => type === body.donationType)
    if (!donationType) {
      return NextResponse.json({ error: 'Choose a valid donation type' }, { status: 400 })
    }
    const donation = reclassifyDonation(id, donationType)
    return NextResponse.json(donation)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 422 })
  }
}
