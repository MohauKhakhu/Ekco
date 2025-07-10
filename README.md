# Ekco Candidate Assessment Solution

This repository contains the solution for the Ekco candidate assessment, consisting of a React frontend and a Node.js backend with PostgreSQL database.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Create a PostgreSQL database named `ekco_assessment`
2. Run the SQL scripts in the `sql/` folder in order:
   - `01_create_tables.sql`
   - `02_populate_data.sql`
   - `03_view_john_smith.sql` (optional)
   - `04_stored_procedures.sql` (optional)

### 2. Backend Setup

1. Navigate to the `backend` folder
2. Create a `.env` file based on your PostgreSQL credentials: