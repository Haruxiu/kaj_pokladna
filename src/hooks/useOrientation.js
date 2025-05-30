import { useEffect } from 'react';

export function useOrientation() {
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.matchMedia("(orientation: portrait)").matches) {
        document.documentElement.classList.add('portrait');
        document.documentElement.classList.remove('landscape');
      } else {
        document.documentElement.classList.add('landscape');
        document.documentElement.classList.remove('portrait');
      }
    };

    handleOrientationChange(); // Initial call
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
}