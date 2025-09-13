# CS Compass Frontend

A modern React-based learning platform for Computer Science education with comprehensive course management, PDF resources, and role-based access control.

## 🚀 Features

### Core Functionality
- **🏠 Landing Page**: Professional homepage with hero section and feature showcase
- **📚 Course Management**: Browse and access course materials with PDF downloads
- **🔐 Authentication System**: Secure login with role-based access control
- **👥 User Roles**: Admin and student roles with different permissions
- **💳 Subscription Management**: Subscription-based content access
- **📱 Responsive Design**: Mobile-first design that works on all devices

### Technical Features
- **⚡ Modern React**: Built with React 18 and TypeScript
- **🎨 Material-UI**: Professional UI components with custom theming
- **🛡️ Security**: Protected routes and secure API integration
- **📊 Loading States**: Skeleton loaders for better user experience
- **🔔 Notifications**: Toast notifications for user feedback
- **🌐 API Ready**: Structured for easy backend integration

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Notifications**: React Toastify
- **Styling**: Material-UI with custom theming
- **Build Tool**: Create React App

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/code94writer/CS-Compass-frontend.git
cd CS-Compass-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Demo Credentials

The application includes mock data for demonstration:

### Admin User
- **Email**: `admin@example.com`
- **Password**: `password`
- **Access**: Full access to all features including upload

### Student User
- **Email**: `user@example.com`
- **Password**: `password`
- **Access**: Course browsing and PDF downloads

### User without Subscription
- **Email**: `nosub@example.com`
- **Password**: `password`
- **Access**: Login only (redirected to login)

## 📁 Project Structure

```
src/
├── api/                    # API service layer
│   ├── auth.ts            # Authentication endpoints
│   ├── pdf.ts             # PDF management endpoints
│   ├── axiosInstance.ts   # Axios configuration
│   └── mockData.ts        # Mock data for development
├── components/             # Reusable UI components
│   ├── Navigation.tsx     # Main navigation bar
│   ├── Footer.tsx         # Footer component
│   └── ProtectedRoute.tsx # Route protection wrapper
├── context/               # React Context providers
│   └── AuthContext.tsx    # Authentication state management
├── pages/                 # Page components
│   ├── Home.tsx           # Landing page
│   ├── Courses.tsx        # Course listing page
│   ├── PDFDetail.tsx      # PDF detail and download
│   ├── Upload.tsx         # Admin upload page
│   └── Login.tsx          # Authentication page
├── types/                 # TypeScript type definitions
│   └── index.ts           # Shared interfaces
├── App.tsx                # Main application component
├── index.tsx              # Application entry point
└── index.css              # Global styles
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=CS Compass
```

### API Integration
The app is configured to work with a backend API. To integrate:

1. Update `REACT_APP_API_URL` in your `.env` file
2. Uncomment real API calls in service files
3. Comment out mock data implementations

### Expected API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User authentication | No |
| GET | `/pdfs` | Get course list | Yes |
| GET | `/pdfs/:id` | Get course details | Yes |
| GET | `/pdfs/:id/download` | Download PDF | Yes |
| POST | `/pdfs/upload` | Upload new course | Admin only |

## 🎨 Customization

### Theming
The app uses Material-UI theming. Customize colors in `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change primary color
    },
    secondary: {
      main: '#dc004e', // Change secondary color
    },
  },
});
```

### Logo and Branding
- Replace `/public/images/Logo.png` with your logo
- Update company information in `src/components/Footer.tsx`
- Modify navigation branding in `src/components/Navigation.tsx`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy!

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npm run deploy
```

## 🔒 Security Features

- **Environment Variables**: Sensitive data stored in `.env` files
- **Protected Routes**: Role-based access control
- **Input Validation**: Form validation and sanitization
- **Secure Headers**: Axios interceptors for security
- **Token Management**: JWT token handling with expiration

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@cscompass.com
- 🐛 Issues: [GitHub Issues](https://github.com/code94writer/CS-Compass-frontend/issues)
- 📖 Documentation: [Wiki](https://github.com/code94writer/CS-Compass-frontend/wiki)

## 🙏 Acknowledgments

- Material-UI for the component library
- React team for the amazing framework
- TypeScript for type safety
- All contributors and supporters

---

**Made with ❤️ for Computer Science Education**

