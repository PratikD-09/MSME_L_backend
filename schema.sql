-- MSME Lending Database Schema

CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  owner_name VARCHAR(255) NOT NULL,
  pan VARCHAR(10) NOT NULL UNIQUE,
  business_type VARCHAR(50) NOT NULL,
  monthly_revenue DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loans (
  id SERIAL PRIMARY KEY,
  loan_amount DECIMAL(15,2) NOT NULL,
  tenure_months INTEGER NOT NULL,
  loan_purpose TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE decisions (
  id SERIAL PRIMARY KEY,
  business_data JSONB,
  loan_data JSONB,
  status VARCHAR(20) NOT NULL,
  credit_score INTEGER NOT NULL,
  reasons JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);