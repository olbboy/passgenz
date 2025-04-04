<div align="center">

![passgenz](/public/images/icons/icon-192.png)

# 🔐 PassGenz - Advanced Password Generator

#### 🚀 Next-Generation Secure Password Generation Solution

A modern, AI-powered password generator built with Next.js 14, featuring quantum-safe algorithms, context-aware analysis, and comprehensive security validation. Combines advanced cryptography with an intuitive UI to create strong, compliant passwords for any service.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)]()
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)]()
[![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-000000?style=flat-square&logo=shadcnui&logoColor=white)]()

[Live Demo](https://passgenz.com) · [Documentation](https://passgenz.com/docs) · [Report Bug](https://github.com/yourusername/passgenz/issues)

</div>

## 📝 Features

1. 🎯 **Multi-Mode Password Generation**:
   - Basic password generation with customizable character sets
   - Pattern-based generation for specific formats
   - Memorable passwords using word combinations
   - Context-aware generation based on service requirements
   - Quantum-safe generation for enhanced security

2. 🤖 **AI-Powered Context Analysis**:
   - Automatic requirement detection from service descriptions
   - Smart security level assessment
   - Compliance standard verification
   - Custom constraint identification
   - Intelligent recommendations

3. 🛡️ **Advanced Security Analysis**:
   - Entropy calculation and strength assessment
   - Quantum resistance evaluation
   - Password breach detection
   - Character distribution analysis
   - Vulnerability identification

4. 🎨 **Modern UI/UX Design**:
   - Clean, responsive interface
   - Real-time password strength visualization
   - Interactive character distribution charts
   - Comprehensive security analysis display
   - Mobile-first approach using Shadcn UI

5. 📊 **Password Requirements Management**:
   - Minimum/maximum length enforcement
   - Required character type combinations
   - Custom character exclusions
   - Pattern restrictions (keyboard patterns, sequences)
   - History policy implementation

6. 💫 **Special Generation Features**:
   - PIN generation (numeric/alphanumeric/extended)
   - ID generation (UUID/nanoid/custom)
   - Secret key generation (hex/base64)
   - Prefix support for IDs
   - Quantum-safe random number generation

7. 🔍 **Validation & Verification**:
   - Real-time requirement validation
   - Service-specific compliance checking
   - Password history verification
   - Pattern detection and enforcement
   - Character set validation

8. 📱 **Progressive Features**:
   - Responsive design for all devices
   - Offline capability
   - Copy to clipboard functionality
   - Password history management
   - Export/import capabilities

## 🚀 Getting Started

To get started with PassGenz, follow these steps:

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 20 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/passgenz.git
   cd passgenz
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables. For example:

   ```plaintext
   GEMINI_API_KEY=your_api_key_here
   ```

### Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

This command will create an optimized production build in the `.next` directory.

### Starting the Production Server

After building the application, you can start the production server with:

```bash
npm start
```

This will serve your application at `http://localhost:3000`.

### Running Tests

To run the tests, use:

```bash
npm run test
```
