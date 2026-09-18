import { useEffect, useState } from 'react';
import type { AnchorHTMLAttributes } from 'react';

export function getPathname() {
  return window.location.pathname || '/dashboard';
}

export function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function usePathname() {
  const [pathname, setPathname] = useState(getPathname);

  useEffect(() => {
    const update = () => setPathname(getPathname());
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);

  return pathname;
}

export function useRouter() {
  return { push: navigate };
}

export function Link({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        if (href.startsWith('/')) {
          event.preventDefault();
          navigate(href);
        }
        props.onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}

export default Link;
