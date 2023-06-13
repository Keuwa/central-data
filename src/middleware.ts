// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/:function*',
}

function isAuthorized(apiKey: string) {
  const authorizeApiKeys = process.env.AUTHORIZED_API_KEY
    ? process.env.AUTHORIZED_API_KEY.split(',')
    : null

  if (authorizeApiKeys) {
    if (authorizeApiKeys.find((e: string) => e === apiKey)) {
      return true
    }
  }

  return false
}

export default function authMiddleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/401')) {
    return NextResponse.next()
  }
  // Call our authentication function to check the request
  let apiKey = ''
  request.headers.forEach((value, name) => {
    if (name === 'authorization') {
      apiKey = value.split(':')[1].trim()
    }
  })
  console.log('test: ', apiKey)
  //   console.log(request.headers)
  if (!isAuthorized(apiKey)) {
    // Respond with JSON indicating an error message
    request.nextUrl.pathname = '/api/401'

    return NextResponse.redirect(request.nextUrl)
  }
}
