# Contributing to InstaPulse

Thank you for your interest in contributing to InstaPulse! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Git installed
- A Supabase account (for development)
- A PayMongo account (for payment testing)

### Setting Up Your Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/InstaPulse.git
   cd InstaPulse
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file using `.env.local.example` as a template
5. Set up your Supabase project and configure environment variables
6. Run the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/your-feature-name`
- `bugfix/your-bugfix-name`
- `hotfix/your-hotfix-name`
- `docs/your-documentation-change`

### Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test your changes thoroughly
4. Commit your changes with a clear message:
   ```bash
   git commit -m "Add: feature description"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a pull request

### Commit Message Format

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: add YouTube link to contact page
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types
- Use interfaces for object shapes
- Use proper type annotations

### React/Next.js

- Use functional components with hooks
- Follow React best practices
- Use proper TypeScript types for props
- Keep components small and focused

### Styling

- Use Tailwind CSS for styling
- Follow the existing color scheme
- Ensure responsive design (mobile-first)
- Use shadcn/ui components when possible

### Code Organization

- Keep related files together
- Use descriptive file and variable names
- Add comments for complex logic
- Follow the existing project structure

## Testing

Before submitting a pull request:
- Test your changes locally
- Check for console errors
- Verify responsive design on different screen sizes
- Test authentication flows if applicable
- Test payment flows if applicable

## Pull Request Guidelines

### PR Description

Include in your PR:
- Clear description of changes
- Screenshots for UI changes (if applicable)
- Related issue numbers
- Testing steps
- Any breaking changes

### Review Process

1. Ensure your PR passes all checks
2. Respond to review feedback promptly
3. Make requested changes
4. Keep the PR focused and small if possible

## Reporting Issues

When reporting bugs:
- Use the issue template
- Provide clear steps to reproduce
- Include screenshots if applicable
- Specify your environment (OS, browser, Node version)
- Check for existing issues first

## Feature Requests

For feature requests:
- Describe the feature clearly
- Explain the use case
- Provide examples if possible
- Consider if it aligns with project goals

## Questions

For questions:
- Check existing documentation first
- Search for similar issues
- Be specific and provide context

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Contact

For questions about contributing, contact admin@instapulse.site

---

Thank you for contributing to InstaPulse!
