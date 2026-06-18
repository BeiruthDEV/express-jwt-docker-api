import { useState, useEffect } from 'react';
import { getBrandLogoUrl, getBrandInitials, normalizeBrandName } from '../utils/brandLogos';

const SIZE_MAP = {
  sm: { box: 'h-8 w-8', text: 'text-[0.6rem]', padding: 'p-1' },
  md: { box: 'h-10 w-10', text: 'text-xs', padding: 'p-1.5' },
  lg: { box: 'h-12 w-12', text: 'text-sm', padding: 'p-1.5' },
  xl: { box: 'h-14 w-14', text: 'text-base', padding: 'p-2' },
};

export default function BrandLogo({ name, size = 'md', className = '', rounded = '2xl' }) {
  const sizes = SIZE_MAP[size] || SIZE_MAP.md;
  const url = getBrandLogoUrl(name);
  const initials = getBrandInitials(name);
  const label = normalizeBrandName(name) || 'sem marca';
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [url]);

  const showImage = url && !errored;
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-2xl';

  if (showImage) {
    return (
      <div
        className={`grid place-items-center bg-white border border-slate-200 shadow-card overflow-hidden ${sizes.box} ${sizes.padding} ${roundedClass} ${className}`}
        title={label}
        aria-label={label}
      >
        <img
          src={url}
          alt={label}
          className="h-full w-full object-contain"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`grid place-items-center bg-gradient-to-br from-emerald-50 to-teal-100 text-brandDark border border-teal-200/70 ${sizes.box} ${sizes.text} ${roundedClass} font-black tracking-tight ${className}`}
      title={label}
      aria-label={label}
    >
      {initials}
    </div>
  );
}
