import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook events
  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, username, first_name, last_name, image_url } = evt.data

    const email = email_addresses[0]?.email_address
    if (!email) {
      return new Response('No email found', { status: 400 })
    }

    try {
      // Upsert user in database
      await prisma.user.upsert({
        where: { email },
        update: {
          username: username || email.split('@')[0],
          firstName: first_name || null,
          lastName: last_name || null,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          avatar: image_url || null,
          emailVerified: email_addresses[0]?.verification?.verified_at_timestamp 
            ? new Date(email_addresses[0].verification.verified_at_timestamp)
            : null,
        },
        create: {
          email,
          username: username || email.split('@')[0],
          password: 'clerk_managed', // Placeholder since Clerk manages auth
          firstName: first_name || null,
          lastName: last_name || null,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          avatar: image_url || null,
          emailVerified: email_addresses[0]?.verification?.verified_at_timestamp 
            ? new Date(email_addresses[0].verification.verified_at_timestamp)
            : null,
        },
      })
    } catch (error) {
      console.error('Error syncing user to database:', error)
      return new Response('Database error', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    
    try {
      // Find user by Clerk ID stored in email (or you could add a clerkId field)
      // For now, we'll skip deletion to preserve data integrity
      console.log('User deleted in Clerk:', id)
      // Optionally soft delete or deactivate the user
    } catch (error) {
      console.error('Error handling user deletion:', error)
    }
  }

  return new Response('', { status: 200 })
}
