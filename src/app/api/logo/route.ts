import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const domain = searchParams.get('domain')
  
  if (!domain) {
    return NextResponse.json({ error: 'Domain required' }, { status: 400 })
  }
  
  const apiKey = process.env.LOGODEV_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ error: 'LogoDev API key not configured' }, { status: 500 })
  }
  
  const logoUrl = `https://img.logo.dev/${domain}?token=${apiKey}`
  
  return NextResponse.json({ logoUrl })
}
