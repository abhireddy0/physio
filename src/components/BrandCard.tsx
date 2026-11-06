import type { ReactNode } from 'react';
import SpotlightCard from './reactbits/SpotlightCard';

/** React Bits SpotlightCard tuned to the brand: light surface, soft teal spotlight that follows the cursor. */
export function BrandCard({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <SpotlightCard
      theme="light"
      spotlightColor="#16706f"
      intensity={0.6}
      spotlightSize={320}
      borderGlow={0.9}
      flare={false}
      className={`brand-card ${className}`.trim()}
    >
      {children}
    </SpotlightCard>
  );
}
