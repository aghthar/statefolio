# 🔥 statefolio 🔥 - the React Native state management showdown

Hey there, fellow React Native developer! 👋 Tired of scratching your head over which state management solution to pick? We've all been there! Let's make this journey fun and insightful.

## 🎯 What's This All About?

We've built the same app six different ways (yes, we're that crazy!) to help you understand each state management solution. Think of it as a "Choose Your Own Adventure" book, but for code!

### 🛠 What We're Building

1. A counter app (because we're legally required to start with one 😉)
2. A todo list (breaking traditions? Never!)
3. All wrapped in beautiful NativeWind styling (because we're fancy)

## 🏃‍♂️ TL;DR - Quick Picks

In a hurry? Here's your cheat sheet:

- **"I'm building the next Facebook"** → Redux Toolkit
- **"I love clean, simple code"** → MobX
- **"Bundle size is my religion"** → Zustand
- **"I'm from the future"** → Recoil
- **"I'm a React purist"** → Context API
- **"I like atomic physics"** → Jotai

## 🎪 The Contestants

### 🏆 Redux Toolkit

```typescript
const IAmInevitable = () => {
  const dispatch = useDispatch();
  // With great power comes great boilerplate
};
```

**Perfect for:** Teams who love meetings about meetings about state management

### 🧪 MobX

```typescript
makeAutoObservable(this);
// Magic! ✨ But the good kind
```

**Perfect for:** People who believe in magic but also want to understand how the trick works

### 🏃‍♂️ Zustand

```typescript
const useStore = create((set) => ({
  bears: 0,
  increaseBears: () => set((state) => ({ bears: state.bears + 1 })),
}));
// That's it. Really. No, we're not kidding.
```

**Perfect for:** Minimalists who still want their DevTools

### ⚛️ Recoil

```typescript
const todoListState = atom({
  key: "TodoList",
  default: [],
});
// Facebook's way of saying "hold my beer"
```

**Perfect for:** Quantum physics enthusiasts who code

### 🤝 Context API

```typescript
const Context = createContext();
// React's built-in solution (it's not just for themes!)
```

**Perfect for:** React traditionalists and minimalists

### ⚡ Jotai

```typescript
const counterAtom = atom(0);
// Atoms! But not the scary radioactive kind
```

**Perfect for:** People who think Redux is too big and Context is too basic

## 🎭 Real Talk: Performance Showdown

We did the heavy lifting so you don't have to! Here's what happened when we made each solution sweat:

| Library       | Bundle Size | Performance | Dev Experience |
| ------------- | ----------- | ----------- | -------------- |
| Redux Toolkit | Chonky boi  | Rock solid  | Detective work |
| MobX          | Just right  | Speedy      | Magic carpet   |
| Zustand       | Tiny        | Lightning   | Smooth sailing |
| Recoil        | Medium      | Quick       | Future proof   |
| Context API   | Free!       | Good enough | Familiar       |
| Jotai         | Smol        | Fast        | Atomic fun     |

## 🎓 Learning Curve Reality Check

- **Redux Toolkit**: "What's a thunk?" - Every junior dev
- **MobX**: "Wait, it just... works?"
- **Zustand**: "Is that all I need to write?"
- **Recoil**: "Facebook uses this, so it must be good, right?"
- **Context API**: "Oh, I know this one!"
- **Jotai**: "Atoms go brrr"

## 🚀 Getting Started

Ready to dive in? Each solution has its own comprehensive guide:

- [Redux Toolkit Guide](./redux-toolkit.md) - The industry standard
- [MobX Guide](./mobx.md) - The reactive powerhouse
- [Zustand Guide](./zustand.md) - The new kid on the block
- [Recoil Guide](./recoil.md) - Facebook's secret sauce
- [Context API Guide](./context-api.md) - React's built-in solution
- [Jotai Guide](./jotai.md) - The atomic challenger

## 🤔 How to Choose?

Ask yourself these questions:

1. **How big is your app?**

   - "It's the next big thing" → Redux Toolkit
   - "It's modest but important" → MobX/Zustand
   - "It's a side project" → Context/Jotai

2. **How's your team?**

   - "We love TypeScript" → Any of them (they all play nice)
   - "We need good docs" → Redux Toolkit/MobX
   - "We hate boilerplate" → Zustand/Jotai

3. **What's your priority?**
   - "Performance" → MobX/Zustand
   - "Ecosystem" → Redux Toolkit
   - "Simplicity" → Context API/Jotai

## 🎉 Final Words

Remember, there's no "perfect" solution - just the right tool for your specific needs. Each library has its own superpowers, and now you know them all!

Want to dive deeper? Check out our:

- [Detailed Comparison Guide](./comparison.md)
- [Performance Deep Dive](./performance.md)
- [Testing Strategies](./testing.md)
- [Migration Guide](./migration.md)

## 📂 Project Structure

```bash
src/
├── app/
│   └── index.tsx           # Main app configuration
├── screens/                # Implementation screens
│   ├── ReduxScreen.tsx
│   ├── MobxScreen.tsx
│   ├── ZustandScreen.tsx
│   ├── RecoilScreen.tsx
│   ├── ContextScreen.tsx
│   └── JotaiScreen.tsx
└── store/                  # State management implementations
    ├── redux/
    ├── mobx/
    ├── zustand/
    ├── recoil/
    ├── context/
    └── jotai/
```

## 🤝 Contributing

Found a typo? Got a cool example? Know a better way? We'd love to hear from you!

Remember: The best state management solution is the one that makes your team productive and your app performant. Now go forth and manage some state! 🚀

---

_P.S. If you enjoyed this guide, consider giving it a ⭐ on GitHub. It helps others find this resource and makes us feel warm and fuzzy inside!_
