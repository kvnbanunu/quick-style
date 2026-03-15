# What is QuickStyle?

QuickStyle is a tool to help style your react project quickly and easily. QuickStyle will take your tailwind styling to the next level!

For projects using Vite+React+Tailwind

# Installation
```
npm install quick-style-hackathon
```

# Setup
1. Setup vite.config.js:
```
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { quickStyle } from 'quick-style-hackathon';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["quick-style-hackathon/babel-plugin"],
      },
    }),
    tailwindcss(),
    quickStyle(),
  ],
});
```

2. Add QuickStyle component to your file

```
import { QuickStyle } from 'quick-style-hackathon';
import 'quick-style-hackathon/style.css';

function App() {
  return (
    <>
      <QuickStyle />
      {/* Your App Code */}
    </>
  );
}
```
