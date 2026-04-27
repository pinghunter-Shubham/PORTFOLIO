import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

/**
 * Proxy contact form submission to the FastAPI backend.
 * Keeps the backend URL server-side only if needed.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown

    const res = await fetch(`${BACKEND_URL}/contact/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json() as { success: boolean; message: string }
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to reach the backend server.' },
      { status: 503 }
    )
  }
}
