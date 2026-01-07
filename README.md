# BestSlot - Online Gaming Platform

BestSlot is a feature-rich online gaming platform built with modern web technologies. It provides a variety of games, a user dashboard for managing account and betting information, real-time chat, notifications, and an admin panel for site management.

## ✨ Features

- **Multi-Game Support:** Play a variety of games including Slots, Poker, Crash, and more.
- **User Dashboard:** Manage your account, view betting records, deposit/withdraw funds, and see profit/loss statements.
- **Real-time Chat:** Communicate with other users in real-time.
- **Notifications:** Receive real-time notifications for important events.
- **Admin Panel:** Manage users, games, and other site settings.
- **Authentication:** Secure user authentication with email/password and social providers.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (managed with [Prisma ORM](https://www.prisma.io/))
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Real-time:** [Ably](https://ably.com/)
- **State Management:** [TanStack Query](https://tanstack.com/query)
- **Email:** [Nodemailer](https://nodemailer.com/)
- **Image Uploads:** [Cloudinary](https://cloudinary.com/)
- **Testing:** [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)
- **Linting/Formatting:** [Biome](https://biomejs.dev/)

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v22 or later)
- [Bun](https://bun.sh/)


### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/sejarparvez/bestslot.git
    cd bestslot
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the necessary environment variables. You can use `.env.example` as a template.

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/bestslot"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-super-secret-key"

    # Add other variables for Ably, Cloudinary, etc.
    ```

4.  **Generate prisma:**

    ```bash
    bunx prisma generate
    ```

5.  **Run the development server:**

    ```bash
    bun dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing

This project uses Jest and React Testing Library for testing. To run the tests, use the following command:

```bash
bun run test
```

## 📂 Project Structure

```
/
├── app/                  # Next.js App Router pages and layouts
│   ├── (home)/           # Logged-out homepage components
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard pages and components
│   └── games/            # Individual game pages
├── actions/              # Server-side actions
├── components/           # Shared UI components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
├── prisma/               # Prisma schema and migrations
├── services/             # Business logic and services
└── __tests__/            # Jest test files
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📜 License

This project is licensed under the MIT License.