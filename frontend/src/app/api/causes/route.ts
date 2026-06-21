import { NextResponse } from 'next/server'
import { listCauses, createCause } from '@/lib/services.server'

export function GET() {
  try {
    return NextResponse.json(listCauses())
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cause = createCause(body)
    return NextResponse.json(cause, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 422 })
  }
}
