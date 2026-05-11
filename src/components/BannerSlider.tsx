import { useState, useEffect } from 'react';

interface BannerSliderProps {
  banners: string[];
  height?: number;
  heightMobile?: number;
  className?: string;
}

const BannerSlider = ({ banners, height = 400, heightMobile = 220, className = '' }: BannerSliderProps) => {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  const currentHeight = isMobile ? heightMobile : height;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height: `${currentHeight}px` }}>
      {banners.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={src} alt="" className="w-full h-full object-contain" loading="lazy" />
        </div>
      ))}
      {banners.length > 1 && (
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-0.5 rounded-full transition-all ${i === current ? 'w-8 bg-white' : 'w-4 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
