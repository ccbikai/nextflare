import { sql } from 'drizzle-orm'
import {
  integer,
  sqliteTable,
  primaryKey,
  text,
} from 'drizzle-orm/sqlite-core'
import { drizzle } from 'drizzle-orm/d1'
import { getRequestContext } from '@cloudflare/next-on-pages'
import type { AdapterAccount } from 'next-auth/adapters'
import type { D1Database } from '@cloudflare/workers-types'

export const users = sqliteTable(
  'user',
  {
    id: text('id').notNull()
      .primaryKey(),
    name: text('name'),
    email: text('email').notNull(),
    emailVerified: integer(
      'emailVerified',
      { mode: 'timestamp' }
    ),
    image: text('image'),
  }
)

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(
        () => users.id,
        { onDelete: 'cascade' }
      ),
    type: text('type').$type<AdapterAccount['type']>()
      .notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [
        account.provider,
        account.providerAccountId,
      ],
    }),
  })
)

export const sessions = sqliteTable(
  'session',
  {
    sessionToken: text('sessionToken').notNull()
      .primaryKey(),
    userId: text('userId')
      .notNull()
      .references(
        () => users.id,
        { onDelete: 'cascade' }
      ),
    expires: integer(
      'expires',
      { mode: 'timestamp' }
    ).notNull(),
  }
)

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer(
      'expires',
      { mode: 'timestamp' }
    ).notNull(),
  },
  vt => ({
    compoundKey: primaryKey({ columns: [
      vt.identifier,
      vt.token,
    ] }),
  })
)

export const webhookEvents = sqliteTable(
  'webhookEvent',
  {
    id: integer(
      'id',
      { mode: 'number' }
    ).primaryKey({ autoIncrement: true }),
    createdAt: integer(
      'createdAt',
      { mode: 'timestamp' }
    ).notNull()
      .default(sql`(current_timestamp)`),
    eventName: text('eventName').notNull(),
    processed: integer(
      'processed',
      { mode: 'boolean' }
    ).default(false),
    body: text(
      'body',
      { mode: 'json' }
    ).notNull(),
    processingError: text('processingError'),
  }
)

export const plans = sqliteTable(
  'plan',
  {
    id: integer(
      'id',
      { mode: 'number' }
    ).primaryKey({ autoIncrement: true }),
    productId: integer('productId').notNull(),
    productName: text('productName'),
    variantId: integer('variantId').notNull()
      .unique(),
    name: text('name').notNull(),
    description: text('description'),
    price: text('price').notNull(),
    isUsageBased: integer(
      'isUsageBased',
      { mode: 'boolean' }
    ).default(false),
    interval: text('interval'),
    intervalCount: integer('intervalCount'),
    trialInterval: text('trialInterval'),
    trialIntervalCount: integer('trialIntervalCount'),
    sort: integer('sort'),
  }
)

export const subscriptions = sqliteTable(
  'subscription',
  {
    id: integer(
      'id',
      { mode: 'number' }
    ).primaryKey({ autoIncrement: true }),
    lemonSqueezyId: text('lemonSqueezyId').unique()
      .notNull(),
    orderId: integer('orderId').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    status: text('status').notNull(),
    statusFormatted: text('statusFormatted').notNull(),
    renewsAt: text('renewsAt'),
    endsAt: text('endsAt'),
    trialEndsAt: text('trialEndsAt'),
    price: text('price').notNull(),
    isUsageBased: integer(
      'isUsageBased',
      { mode: 'boolean' }
    ).default(false),
    isPaused: integer(
      'isPaused',
      { mode: 'boolean' }
    ).default(false),
    subscriptionItemId: integer('subscriptionItemId').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => users.id),
    planId: integer('planId')
      .notNull()
      .references(() => plans.id),
  }
)

// Export types for the tables.
export type NewPlan = typeof plans.$inferInsert
export type NewWebhookEvent = typeof webhookEvents.$inferInsert
export type NewSubscription = typeof subscriptions.$inferInsert

function initDBConnection() {
  if (process.env.NODE_ENV === 'development') {
    const { env } = getRequestContext()

    return env.DB
  }

  return process.env.DB as unknown as D1Database
}

const DB = initDBConnection()
// const DB = process.env.DB ?? 'sqlite';

// export const sql = DB;
export const db = drizzle(DB)
