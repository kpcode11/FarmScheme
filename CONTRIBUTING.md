# Contributing to Farmers Support Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser)

### Suggesting Features

Feature suggestions are welcome! Please provide:

- **Clear use case** - Why is this feature needed?
- **Detailed description** - What should it do?
- **Mockups or examples** if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding standards** (see below)
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**

## 🛠️ Development Setup

1. Follow the installation steps in [README.md](README.md)
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Coding Standards

### JavaScript/React

- Use **ES6+** syntax
- Follow **functional components** with hooks
- Use **meaningful variable names**
- Add **comments** for complex logic
- Keep functions **small and focused**

### Code Formatting

- Use **2 spaces** for indentation
- Add **semicolons**
- Use **single quotes** for strings
- Maximum line length: **100 characters**

### File Naming

- Components: `PascalCase.jsx` (e.g., `Dashboard.jsx`)
- Utilities: `camelCase.js` (e.g., `apiHelper.js`)
- Styles: `ComponentName.css`

## 🧪 Testing

- Test all new features before submitting
- Ensure existing functionality still works
- Test on multiple browsers if UI changes

## 📋 Commit Message Guidelines

Use clear and descriptive commit messages:

```
type: subject

body (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat: add password reset functionality
fix: resolve login authentication issue
docs: update API documentation
```

## 🔍 Pull Request Process

1. **Update the README.md** with details of changes if applicable
2. **Ensure all tests pass** and the app runs without errors
3. **Update the documentation** for any new features
4. **Request review** from maintainers
5. **Address feedback** and make requested changes
6. **Squash commits** if requested before merging

## 🎯 Project Structure Guidelines

### Backend (server/)

- **controllers/** - Request handlers, keep them thin
- **models/** - Mongoose schemas, include validation
- **routes/** - API routes, one file per resource
- **middleware/** - Custom middleware functions
- **utils/** - Reusable utility functions

### Frontend (client/Learning/)

- **components/** - Reusable React components
- **context/** - React Context providers
- **hooks/** - Custom React hooks
- **config/** - Configuration files
- **utils/** - Helper functions

## 🐛 Debugging Tips

### Backend Issues

```bash
# Enable debug mode
DEBUG=* npm run dev

# Check MongoDB connection
node -e "console.log(process.env.MONGODB_URL)"
```

### Frontend Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check environment variables
npm run dev -- --debug
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

## ❓ Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project (ISC License).

---

Thank you for contributing! 🎉
