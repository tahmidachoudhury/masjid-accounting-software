import { NextResponse } from 'next/server'
import { computeBalances } from '@/lib/services.server'

export function GET() {
  try {
    return NextResponse.json(computeBalances())
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
