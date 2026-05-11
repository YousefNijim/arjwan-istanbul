import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface BannerSliderProps {
  banners: string[];
  bannersMobile?: string[];
  height?: number;
  heightMobile?: number;
  links?: string[];
  className?: string;
}

const BannerSlider = ({
  banners,
  bannersMobile,
  height = 400,
  heightMobile = 220,
  links = [],
  className = '',
}: BannerSliderProps) => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => { setIsMobile(e.matches); setCurrent(0); };
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const activeBanners = isMobile && bannersMobile && bannersMobile.length > 0 ? bannersMobile : banners;
  const activeHeight = isMobile ? heightMobile : height;

  useEffect(() => { setCurrent(0); }, [activeBanners]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => setCurrent(p => (p + 1) % activeBanners.length), 5000);
    return () => clearInterval(timer);
  }, [activeBanners]);

  if (!activeBanners.length) return null;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height: `${activeHeight}px` }}>
      {activeBanners.map((src, i) => {
        const href = links[i];
        const inner = (
          <img
            src={src}
            alt=""
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        );

        return (
          <div
            key={src + i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          >
            {href ? (
              <Link to={href} className="group block w-full h-full cursor-pointer">
                {inner}
              </Link>
            ) : (
              <div className="group w-full h-full">
                {inner}
              </div>
            )}
          </div>
        );
      })}

      {activeBanners.length > 1 && (
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2 z-10">
          {activeBanners.map((_, i) => (
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
