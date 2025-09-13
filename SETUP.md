# CS Compass Frontend - Setup Guide

This guide will help you set up the CS Compass Frontend project for development and deployment.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

### 1. Install Git (if not already installed)

#### Windows:
1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer and follow the setup wizard
3. Open Command Prompt or PowerShell and verify installation:
   ```bash
   git --version
   ```

#### macOS:
```bash
# Using Homebrew
brew install git

# Or download from git-scm.com
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install git
```

### 2. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/code94writer/CS-Compass-frontend.git

# Navigate to the project directory
cd CS-Compass-frontend
```

### 3. Install Dependencies

```bash
# Install all required packages
npm install

# Or if you prefer yarn
yarn install
```

### 4. Environment Setup

```bash
# Copy the environment template
cp env.example .env

# Edit the .env file with your configuration
# Windows: notepad .env
# macOS/Linux: nano .env
```

### 5. Start Development Server

```bash
# Start the development server
npm start

# The app will open at http://localhost:3000
```

## 🔧 Development Setup

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Git Configuration

Set up your Git identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Branch Strategy

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Create a new bugfix branch
git checkout -b bugfix/issue-description

# Create a new hotfix branch
git checkout -b hotfix/critical-fix
```

## 🚀 Deployment Setup

### GitHub Pages Deployment

1. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to Pages section
   - Select "GitHub Actions" as source

2. **Deploy automatically**:
   - Push to main branch
   - GitHub Actions will build and deploy automatically

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to any static hosting service
# Upload the 'build' folder contents
```

### Environment Variables for Production

Create these environment variables in your hosting platform:

```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_APP_NAME=CS Compass
REACT_APP_ENVIRONMENT=production
```

## 🧪 Testing Setup

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix
```

### Type Checking

```bash
# Check TypeScript types
npm run type-check
```

## 🔒 Security Setup

### Environment Security

1. **Never commit sensitive data**:
   - Add `.env` to `.gitignore`
   - Use `env.example` as template
   - Store secrets in environment variables

2. **API Security**:
   - Use HTTPS in production
   - Implement proper authentication
   - Validate all inputs

### Dependencies Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

## 📱 Mobile Development

### Testing on Mobile

1. **Local Network Testing**:
   ```bash
   # Start with network access
   npm start
   # Access via your computer's IP address
   ```

2. **Mobile Device Testing**:
   - Use Chrome DevTools device emulation
   - Test on actual devices
   - Use tools like BrowserStack for cross-platform testing

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm start
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Git Issues
```bash
# Reset to last commit
git reset --hard HEAD

# Pull latest changes
git pull origin main

# Check git status
git status
```

### Performance Issues

```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
npm start -- --max_old_space_size=4096
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Router Documentation](https://reactrouter.com/)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

### Learning Resources
- [React Tutorial](https://reactjs.org/tutorial/tutorial.html)
- [TypeScript Tutorial](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [Material-UI Tutorial](https://mui.com/getting-started/learn/)

## 🤝 Getting Help

If you encounter issues:

1. **Check the documentation** first
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Ask in discussions** for general questions

## 📞 Support

- **Email**: support@cscompass.com
- **GitHub Issues**: [Create an issue](https://github.com/code94writer/CS-Compass-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/code94writer/CS-Compass-frontend/discussions)

---

Happy coding! 🎉
