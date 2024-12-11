# 🔥 State Management Showdown with Expo Router

A comprehensive comparison of different state management solutions in React Native with Expo Router, featuring:

- Redux Toolkit
- MobX
- Zustand
- Recoil
- Context API
- Jotai

## 📱 Features

Each implementation includes:

- Counter functionality
- Todo list management
- Dark mode support
- Safe area handling
- TypeScript integration
- NativeWind styling

## 🏗 Project Structure

```bash
src/
├── app/                    # Expo Router app directory
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Home screen with navigation
│   ├── redux.tsx          # Redux implementation
│   ├── mobx.tsx           # MobX implementation
│   ├── zustand.tsx        # Zustand implementation
│   ├── recoil.tsx         # Recoil implementation
│   ├── context.tsx        # Context implementation
│   └── jotai.tsx          # Jotai implementation
├── components/            # Shared components
│   └── BaseScreen.tsx     # Base screen layout
├── hooks/                 # Custom hooks
│   └── useColorScheme.ts  # Color scheme hook
└── store/                 # State management implementations
    ├── redux/
    ├── mobx/
    ├── zustand/
    ├── recoil/
    ├── context/
    └── jotai/
```

## 🤝 Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

## 📚 Implementation Guides

Each state management solution has its own detailed guide:

- [Redux Toolkit Guide](./redux-toolkit.md)
- [MobX Guide](./mobx.md)
- [Zustand Guide](./zustand.md)
- [Recoil Guide](./recoil.md)
- [Context API Guide](./context-api.md)
- [Jotai Guide](./jotai.md)

## 📊 Comparison

### Bundle Size Impact

| Library       | Size   | Initial Load |
| ------------- | ------ | ------------ |
| Redux Toolkit | 22.3kb | ~180ms       |
| MobX          | 16.8kb | ~150ms       |
| Zustand       | 3.4kb  | ~80ms        |
| Recoil        | 20.5kb | ~170ms       |
| Context API   | 0kb    | ~50ms        |
| Jotai         | 5.6kb  | ~90ms        |

### Quick Picks

- **Large Enterprise Apps** → Redux Toolkit
- **Medium-sized Apps** → MobX or Recoil
- **Small to Medium Apps** → Zustand or Jotai
- **Simple Apps** → Context API

## 🛠 Technical Stack

- Expo SDK 52
- React Native 0.76.3
- TypeScript 5.3.3
- NativeWind 4.1.23
- Expo Router 4.0.11

## 📖 Additional Resources

- [Performance Deep Dive](./performance.md)
- [Testing Strategies](./testing.md)
- [Migration Guide](./migration.md)
- [Detailed Comparison](./comparison.md)

## 🤝 Contributing

Found a bug? Want to add a feature? Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT

---

Built with ❤️ using Expo Router
