# Anime Prompt Generator

This project is a versatile prompt generator designed to create random image prompts for various themes, including anime, monsters, and aliens. The prompts can be randomized and exported as JSON, making them suitable for bulk image creation workflows.

## Features
- Generate random prompts for anime, monsters, and aliens.
- Export prompts in JSON format for bulk image creation.
- Customizable and extendable prompt generation logic.

## Authentication
Management endpoints use shared WebHatchery bearer-token authentication. The app does not expose local login or registration endpoints. Unauthenticated protected API requests return HTTP 401 with `login_url`, and users can either sign in through `https://webhatchery.au/login` or continue with a signed guest JWT.

Required auth environment variables:
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `WEBHATCHERY_LOGIN_URL`
- `VITE_WEBHATCHERY_LOGIN_URL`
- `VITE_WEBHATCHERY_SIGNUP_URL`

## Frontend Overview
The frontend is built using modern web technologies:
- **React**: For building the user interface.
- **Tailwind CSS**: For styling.
- **Vite**: For fast development and build processes.
- **Zustand**: For state management.

## Build Instructions
To set up and build the project, follow these steps:

1. **Install Dependencies**:
   ```powershell
   cd frontend
   npm install
   ```

2. **Run the Development Server**:
   ```powershell
   npm run dev
   ```
   This will start the development server, and you can access the application in your browser.

3. **Build for Production**:
   ```powershell
   npm run build
   ```
   This will generate the production-ready files in the `dist` directory.

4. **Preview the Production Build**:
   ```powershell
   npm run preview
   ```
   This will serve the production build locally for testing.

## Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests.
