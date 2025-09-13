# Contributing to CS Compass Frontend

Thank you for your interest in contributing to CS Compass! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- A GitHub account

### Development Setup

1. **Fork the repository**
   - Click the "Fork" button on the GitHub repository page
   - Clone your fork: `git clone https://github.com/YOUR_USERNAME/CS-Compass-frontend.git`

2. **Set up the development environment**
   ```bash
   cd CS-Compass-frontend
   npm install
   npm start
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Use Material-UI components when possible

### Commit Messages
Follow the conventional commit format:
```
type(scope): description

feat(auth): add two-factor authentication
fix(ui): resolve mobile navigation issue
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests if applicable
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests
- Write unit tests for new components
- Test user interactions and edge cases
- Maintain good test coverage

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Environment details** (OS, browser, Node version)
6. **Error messages** or console logs

## ✨ Feature Requests

When suggesting features:

1. **Check existing issues** first
2. **Describe the problem** you're trying to solve
3. **Explain your proposed solution**
4. **Consider alternatives** you've thought about
5. **Provide mockups** or examples if possible

## 📚 Documentation

### Code Documentation
- Use JSDoc comments for functions and components
- Keep README.md updated
- Document API changes
- Add inline comments for complex logic

### README Updates
When adding new features, update:
- Feature list
- Installation instructions
- Usage examples
- Configuration options

## 🎨 UI/UX Guidelines

### Design Principles
- **Consistency**: Follow Material-UI design patterns
- **Accessibility**: Ensure keyboard navigation and screen reader support
- **Responsiveness**: Test on multiple screen sizes
- **Performance**: Optimize for fast loading

### Component Guidelines
- Use Material-UI components when possible
- Create reusable components
- Follow the existing component structure
- Use TypeScript interfaces for props

## 🔒 Security

### Security Guidelines
- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Validate all user inputs
- Follow secure coding practices
- Report security vulnerabilities privately

### Security Checklist
- [ ] No hardcoded secrets
- [ ] Input validation implemented
- [ ] HTTPS used in production
- [ ] Dependencies updated
- [ ] Security headers configured

## 📋 Pull Request Template

When creating a PR, please include:

### Description
Brief description of changes

### Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

### Testing
- [ ] Tests pass locally
- [ ] New tests added (if applicable)
- [ ] Manual testing completed

### Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design tested

## 🤝 Community Guidelines

### Be Respectful
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Communication
- Use clear, concise language
- Provide context for your suggestions
- Ask questions when you need clarification
- Help others when you can

## 📞 Getting Help

If you need help:

1. **Check the documentation** first
2. **Search existing issues** for similar problems
3. **Ask in discussions** for general questions
4. **Create an issue** for bugs or feature requests
5. **Join our community** (if available)

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to CS Compass! 🎉
