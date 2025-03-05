# ReadRater: Book Review Platform 📖✨

## 🚀 Project Overview

ReadRater is a comprehensive book review platform that allows users to discover, review, and rate books. The application provides a seamless experience for book enthusiasts to explore literary works, share their insights, and connect with a community of readers.

## ✨ Features

- User Authentication
- Book Browsing
- Detailed Book Pages
- Review Submission
- User Profiles
- Advanced Search and Filtering

## 📋 Project Structure

```
project/
│
├── src/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   │   ├── Auth.tsx
│   │   ├── BookDetails.tsx
│   │   ├── Books.tsx
│   │   ├── Home.tsx
│   │   └── Profile.tsx
│   ├── store/
│   │   └── authStore.tsx
│   ├── App.tsx
│   └── main.tsx
│
├── backend/  (Future Implementation)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
```

## 🛠 Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Supabase Authentication
- Zustand (State Management)
- React Router
- Framer Motion

### Backend (Planned)
- Node.js
- Express
- SQL/MongoDB

## 📦 Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase Account

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/readrater.git
cd readrater
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Supabase Configuration

1. Create a new Supabase project
2. Set up the following database tables:

#### Users Table
- `id`: uuid (primary key)
- `email`: text
- `username`: text (unique)
- `created_at`: timestamp

#### Books Table
- `id`: uuid (primary key)
- `title`: text
- `author`: text
- `genre`: text
- `description`: text
- `cover_url`: text
- `published_date`: date

#### Reviews Table
- `id`: uuid (primary key)
- `user_id`: uuid (foreign key to users.id)
- `book_id`: uuid (foreign key to books.id)
- `rating`: integer (1-5)
- `comment`: text
- `created_at`: timestamp

### 4. Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Authentication Setup

1. Enable Email Authentication in Supabase
2. Configure email templates
3. Set up Row Level Security (RLS) policies

### 6. Run the Application

```bash
npm run dev
# or
yarn dev
```

## 🧪 Test Account

For quick access during development:
- **Email:** g12bhoomika@gmail.com
- **Password:** bhoomika

## 🔍 Upcoming Features

- [ ] Implement backend RESTful API
- [ ] Add advanced search and filtering
- [ ] Implement admin panel for book management
- [ ] Add social sharing features
- [ ] Develop recommendation system

## 🤝 Contribution Guidelines

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 Coding Standards

- Follow React best practices
- Use TypeScript for type safety
- Maintain consistent code formatting
- Write comprehensive comments
- Create unit tests for critical components

## 🛡️ Security Considerations

- Implement proper authentication flows
- Use environment variables for sensitive information
- Validate and sanitize user inputs
- Implement rate limiting
- Use HTTPS for all communications

## 📚 Learning Resources

- [React Documentation](https://reactjs.org/)
- [Supabase Guide](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)


## 📄 License

Distributed under the MIT License.

**Happy Reading!** 📖✨
