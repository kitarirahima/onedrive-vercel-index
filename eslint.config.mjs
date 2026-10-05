import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'
import { fixupConfigRules } from '@eslint/compat'

export default [
  ...fixupConfigRules(nextVitals),
  prettier,
  {
    // These effects read browser state after SSR; keep their existing hydration behavior.
    files: ['src/components/Navbar.tsx', 'src/utils/useDeviceOS.ts', 'src/utils/useLocalStorage.ts'],
    rules: { 'react-hooks/set-state-in-effect': 'off' },
  },
]
