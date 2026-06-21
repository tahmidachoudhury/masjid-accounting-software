import { NextResponse } from 'next/server'
import { importBankStatement } from '@/lib/services.server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json({ error: 'Uploaded file must be a .csv' }, { status: 400 })
    }

    const content = await file.text()
    return NextResponse.json(importBankStatement(content))
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
