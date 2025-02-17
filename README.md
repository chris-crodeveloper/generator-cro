# CRO File Generator

A powerful and configurable Yeoman generator for scaffolding Conversion Rate Optimization (CRO) test files. Built with flexibility in mind, it comes pre-configured with Generic CRO Templates and Optimizely integration.

## ✨ Key Features

- 🚀 Interactive prompts for quick boilerplate generation
- 🎯 Seamless Optimizely integration
  - Create new experiments directly within Optimizely
  - Fetch existing experiments and generate local files
  - Automatic ID management and retrieval
- 📁 Unlimited custom template support
- 🛠️ Multi-file type support (JS, CSS, HTML)
- 🔧 Configurable for both local files and server deployment
- 🎨 Extensible architecture for custom file types

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# Install Yeoman globally
npm install -g yo@5.0.0

# Install the generator and dependencies
npm install
```

## ⚙️ Configuration

The generator uses a `cro.config.js` file in your project's root directory for configuration. This file should be version controlled to maintain consistency across your development team.

### Optimizely Setup

To enable Optimizely features, you'll need to configure the following:

```javascript
optimizely: {
  projects: [{
    project_name: "Your Project Name",
    auth_token: "YOUR_AUTH_TOKEN",
    project_id: "YOUR_PROJECT_ID",
    audiences: {
      "QA Audience": "audience_id_1",
      "Beta Users": "audience_id_2"
    },
    default: true
  }]
}
```

> 💡 **Note**: Optimizely features require both Auth Token and Project ID. [Learn how to generate your Personal Access Token](https://docs.developers.optimizely.com/web-experimentation/docs/personal-access-token).

### Default Configuration

Customize your workflow with these optional settings:

```javascript
prompts: {
  config: {
    childFolders: ["feature", "bug-fix", "optimization"],
    developers: ["John", "Jane", "Alex"],
    homepageUrl: "https://example.com",
    testIdExample: "TEST-123",
    testNameExample: "Homepage Hero Test"
  }
}
```

### File Configuration

Control which files are generated and how:

```javascript
prompts: {
  files: {
    javascript: {
      showInPrompts: true,
      checkedByDefault: true,
      fileExtension: "js",
      singleFile: false
    }
    // Add more file types as needed
  }
}
```

### Output Configuration

Specify where and how files should be generated:

```javascript
output: {
  destination: "tests",
  localhost: "http://localhost:3000"
}
```

## 📝 Template Variables

Use these variables in your templates:

### Test Details
- `<%= testId %>` - Test identifier
- `<%= testName %>` - Test name
- `<%= testUrl %>` - Test URL
- `<%= testDescription %>` - Test description
- `<%= developer %>` - Developer name

### Variation Details
- `<%= variations.control.id %>` - Control variation ID
- `<%= variations.control.name %>` - Control variation name
- `<%= variations.currentVariation.id %>` - Current variation ID
- `<%= variations.currentVariation.name %>` - Current variation name

### File Paths
- `<%= folderName.variation %>` - Variation file path
- `<%= folderName.shared %>` - Shared file path
- `<%= folderName.control %>` - Control file path

## 🎨 Custom Templates

Create your own templates following this structure:

```
customTemplates/
├── src/
│   ├── js/
│   │   ├── control.js
│   │   ├── variation-x.js
│   │   └── shared.js
│   ├── css/
│   │   ├── control.css
│   │   ├── variation-x.css
│   │   └── shared.css
│   └── README.md
```

Configure your custom template directory:

```javascript
templates: {
  customDirectory: "customTemplates"
}
```

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

The tests verify that prompt selections correctly generate the expected folder structure and files.

## 🛠️ Built With

- [Yeoman](https://yeoman.io/) - Web scaffolding tool
- [Optimizely API v2](https://library.optimizely.com/docs/api/app/v2/index.html) - A/B testing platform API

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👨‍💻 Author

**Chris Davies**

---

Made with ❤️ for the CRO community