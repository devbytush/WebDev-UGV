import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenisInstance } from '../lib/motion';

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: false,
      respectReducedMotion: true,
    });
    setLenisInstance(lenis);

    return () => {
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);
}
