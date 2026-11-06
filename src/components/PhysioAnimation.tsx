import { useEffect, useRef, useState } from 'react';

type DotLottiePlayer = typeof import('@lottiefiles/dotlottie-react').DotLottieReact;

export function PhysioAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [Player, setPlayer] = useState<DotLottiePlayer | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setShouldAnimate(!motionPreference.matches);

    updateMotionPreference();
    motionPreference.addEventListener('change', updateMotionPreference);

    const loadPlayer = async () => {
      try {
        const { DotLottieReact } = await import('@lottiefiles/dotlottie-react');
        if (!cancelled) setPlayer(() => DotLottieReact);
      } catch (error) {
        console.error('Unable to load the physiotherapy animation player.', error);
        if (!cancelled) setLoadError(true);
      }
    };

    let observer: IntersectionObserver | undefined;
    if (container && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer?.disconnect();
            void loadPlayer();
          }
        },
        { rootMargin: '160px' },
      );
      observer.observe(container);
    } else {
      void loadPlayer();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      motionPreference.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  return (
    <div ref={containerRef} className="home-visits__animation-player">
      {Player ? (
        <Player
          key={shouldAnimate ? 'animated' : 'still'}
          src="/animations/physiotherapy.lottie"
          autoplay={shouldAnimate}
          loop={shouldAnimate}
          role="img"
          aria-label="Animated physiotherapy illustration"
        />
      ) : loadError ? (
        <p role="status">The animation could not be loaded.</p>
      ) : (
        <span className="visually-hidden">Physiotherapy illustration loading</span>
      )}
    </div>
  );
}
