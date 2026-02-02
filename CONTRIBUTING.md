# Contributing to CBT Framework

Thank you for your interest in contributing to CBT Framework! This document provides guidelines for contributing.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/TradeWithAI/cbt-framework/issues)
2. If not, create a new issue with:
   - Clear title describing the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node version, Python version)

### Suggesting Features

1. Check existing [Issues](https://github.com/TradeWithAI/cbt-framework/issues) for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Use case / why it's needed
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Write/update tests if applicable
5. Update documentation if needed
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 16+
- Python 3.8+
- Claude Code CLI

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/cbt-framework.git
cd cbt-framework

# Install to local Claude Code
node bin/cbt-init.js

# Test your changes
# (Use /cbt: commands in Claude Code)
```

### Testing Commands

Test your command changes by running them in Claude Code:

```
/cbt:help
/cbt:new test_strategy
/cbt:status
```

## Code Style

### JavaScript (Installer/Hooks)

- Use Node.js 16+ features
- No external dependencies for installer
- Clear console output with colors

### Markdown (Commands)

- Clear YAML frontmatter
- Structured `<process>` sections
- Include `<success_criteria>`

### Python (Templates/Engine)

- Follow PEP 8
- Type hints where helpful
- Docstrings for classes and methods
- No external backtesting libraries

## Command Guidelines

When creating or modifying commands:

1. **Frontmatter** - Include name, description, argument-hint, allowed-tools
2. **Objective** - Clear statement of what the command does
3. **Process** - Step-by-step execution instructions
4. **Success Criteria** - Checkboxes for completion

Example structure:

```markdown
---
name: cbt:example
description: Short description
argument-hint: "[optional args]"
allowed-tools:
  - Read
  - Write
---

<objective>
What this command accomplishes.
</objective>

<process>
## Step 1
Instructions...

## Step 2
Instructions...
</process>

<success_criteria>
- [ ] Criterion 1
- [ ] Criterion 2
</success_criteria>
```

## Areas for Contribution

### High Priority

- Bug fixes
- Documentation improvements
- Additional config presets
- Test coverage

### Medium Priority

- New analysis features
- Additional metrics
- Performance optimizations

### Future Features

- Multi-asset support
- Portfolio backtesting
- Live trading integration
- Report generation

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers

## Questions?

Open an issue with the `question` label or reach out to the maintainers.

---

Thank you for contributing!
