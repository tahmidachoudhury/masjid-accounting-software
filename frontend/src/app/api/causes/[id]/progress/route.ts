import { NextResponse } from 'next/server'
import { computeCauseProgress } from '@/lib/services.server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    return NextResponse.json(computeCauseProgress(id))
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 404 })
  }
}
