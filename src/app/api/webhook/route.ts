import { processWebhookEvent, storeWebhookEvent } from '@/app/actions'
import { webhookHasMeta } from '@/lib/typeguards'

export const runtime = 'edge'

export async function POST(request: Request) {
  if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    return new Response(
      'Lemon Squeezy Webhook Secret not set in .env',
      {
        status: 500,
      }
    )
  }

  // First, make sure the request is from Lemon Squeezy.
  const rawBody = await request.text()
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET

  /*
     * const hmac = crypto.createHmac(
     *   'sha256',
     *   secret
     * )
     * const digest = Buffer.from(
     *   hmac.update(rawBody).digest('hex'),
     *   'utf8'
     * )
     * const signature = Buffer.from(
     *   request.headers.get('X-Signature') ?? '',
     *   'utf8'
     * )
     */

  /*
     * if (!crypto.timingSafeEqual(
     *   digest,
     *   signature
     * )) {
     *   return new Response(
     *     'Invalid signature',
     *     { status: 400 }
     *   )
     * }
     */

  const secretBuffer = new TextEncoder().encode(secret)
  const key = await crypto.subtle.importKey(
    'raw',
    secretBuffer,
    { name: 'HMAC',
      hash: { name: 'SHA-256' } },
    false,
    ['sign']
  )

  const rawBodyBuffer = new TextEncoder().encode(rawBody)
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    rawBodyBuffer
  )

  const hexSignature = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(
      2,
      '0'
    ))
    .join('')
  const requestSignature = request.headers.get('X-Signature') ?? ''

  if (hexSignature !== requestSignature) {
    return new Response(
      'Invalid signature',
      { status: 400 }
    )
  }

  const data = JSON.parse(rawBody) as unknown

  // Type guard to check if the object has a 'meta' property.
  if (webhookHasMeta(data)) {
    const webhookEventId = await storeWebhookEvent(
      data.meta.event_name,
      data
    )

    // Non-blocking call to process the webhook event.
    void processWebhookEvent(webhookEventId)

    return new Response(
      'OK',
      { status: 200 }
    )
  }

  return new Response(
    'Data invalid',
    { status: 400 }
  )
}
