import { useState, useEffect } from 'react';

interface BannerSliderProps {
  banners: string[];
  className?: string;
}

const BannerSlider = ({ banners, className = '' }: BannerSliderProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <div className={`relative aspect-[2/1] md:aspect-[4/1] overflow-hidden ${className}`}>
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
