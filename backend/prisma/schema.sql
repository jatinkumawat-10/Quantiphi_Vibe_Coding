-- ============================================================
-- Subscription Tracker & Renewal Dashboard - PostgreSQL Schema
-- ============================================================
-- This file is the raw SQL equivalent of the Prisma schema.
-- It is provided for reference, manual setup, and migration backup.
-- The canonical source of truth is prisma/schema.prisma.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM Types
-- ============================================================

CREATE TYPE billing_cycle AS ENUM ('MONTHLY', 'YEARLY');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'PAUSED');

-- ============================================================
-- Table: users
-- ============================================================

CREATE TABLE users (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    username      VARCHAR(50)  UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ============================================================
-- Table: subscriptions
-- ============================================================

CREATE TABLE subscriptions (
    id                   UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_name         VARCHAR(100)        NOT NULL,
    cost                 DECIMAL(10, 2)      NOT NULL CHECK (cost > 0),
    billing_cycle        billing_cycle       NOT NULL,
    next_renewal_date    DATE                NOT NULL,
    status               subscription_status NOT NULL DEFAULT 'ACTIVE',
    -- Feature 2: Notes (free-text)
    notes                TEXT,
    -- Feature 3: Cost-splitting (shared subscriptions)
    is_shared            BOOLEAN             NOT NULL DEFAULT FALSE,
    split_count          INT                 NOT NULL DEFAULT 1,
    split_note           VARCHAR(255),
    -- Feature 4: Free trial tracker
    is_trial             BOOLEAN             NOT NULL DEFAULT FALSE,
    trial_end_date       DATE,
    trial_reminder_days  INT                 NOT NULL DEFAULT 3,
    created_at           TIMESTAMPTZ         NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ         NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes for performance
-- ============================================================

-- Fast lookup of all subscriptions for a user
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Fast lookup of active/paused subscriptions for a user
CREATE INDEX idx_subscriptions_user_status ON subscriptions(user_id, status);

-- Fast lookup for upcoming renewal date queries
CREATE INDEX idx_subscriptions_user_renewal_date ON subscriptions(user_id, next_renewal_date);

-- ============================================================
-- Trigger: auto-update updated_at on users
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
