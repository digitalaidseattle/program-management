# Digital Aid Seattle - Program Management

This web application facilitates the daily operation of DAS (Digital Aid Seattle).  The application provides access to:

1. Personal dashboard
2. Profile management
3. Team management
4. Meeting management
5. DAS references

## Dependencies
The template is built with:
* React
* TypeScript
* Material UI
* Vite
* Supabase

## Installation
These are instructions to run the DAS Program Management application on your local workstation.  By default, the application will use Supabase's cloud server.  Included are instructions to start and use a local Supabase server.

### Prequisites
- Connectivity to the internet
- Node JS, at least version 22
- Git

### Setting up code base
1. Clone this repository, if you are using a shell:
   ```
   git clone https://github.com/digitalaidseattle/program-management
   ```
2. Request access to Proton to get environment files for this application.
3. Download environment variables for local development from DAS' Proton account.
4. Put the file in the root directory of this project.
5. Rename the file to .env.local
6. Download module dependencies by invoking:
   ```
   npm run dev
   ```
7. Start the application on your workstation:
   ```
   npm run dev
   ```
2. Open http://localhost:3000 to view the app.

### Using a local Supabase server (Optional)
Supabase provide mechanisms to use a local server, which provides authentication, file storage, and database functions.  

#### Prequisites
- **[Docker](https://www.docker.com/)**
- **[Supabase CLI](https://supabase.com/docs/guides/local-development)**

#### Setup Instructions
1. Open Docker app and wait until it is running
2. Initialize Supabse:
   ```
   supabase init
   ```
   > **Note:**  `supabase init` may overwrite the docker file `config.toml`. .env` when running the app locally.  Restore the file from the repository.
3. Start local Supabase:
   ```
   supabase start
   ```
4. Update `.env.local` to use the local Supabase server.
   1. Get the anon key from the local Supabase studio
   2. Change the anon key in `.env.local` to use local key
5. To stop the local supabase:
   ```
   supabase stop