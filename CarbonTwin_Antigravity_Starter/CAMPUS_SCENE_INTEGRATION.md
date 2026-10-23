# Integrating `CampusScene.tsx`

## 1. Install dependencies

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

The project should already have React, TypeScript and Vite. Tailwind utility classes are used by the starter scene; if Tailwind is not installed, add it or replace those classes with regular CSS.

## 2. Import into a page

```tsx
import { useState } from "react";
import CampusScene, { type CampusBuilding } from "./components/CampusScene";

export default function CampusPage() {
  const [activeBuilding, setActiveBuilding] = useState<CampusBuilding | null>(null);

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white">
      <h1 className="mb-4 text-2xl font-semibold">3D Campus</h1>
      <div style={{ height: "75vh", minHeight: 520 }}>
        <CampusScene onSelectBuilding={setActiveBuilding} />
      </div>
      {activeBuilding && (
        <p className="mt-3 text-sm text-slate-300">
          Selected: {activeBuilding.name}
        </p>
      )}
    </main>
  );
}
```

## 3. Replace sample values with twin state

Pass the `buildings` prop using values from the shared simulation state/API. Do not keep a second, separate set of building metrics inside the scene.

## 4. Notes

- The included building dimensions, names and values are illustrative sample data.
- The scene is a procedural starter, not a photorealistic architectural reconstruction.
- Add actual Blender assets or improved geometry after click selection and data synchronization work.
- For production, move the `document.body.style.cursor` change into a more robust pointer-state handler and restore the cursor on unmount.
- Use React error boundaries and detect WebGL failure to show a fallback UI.
- Test performance on the target laptop before adding many high-poly assets.
