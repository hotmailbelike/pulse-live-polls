import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { navigate } from '../lib/navigation';

interface NavLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
}

const PRIMARY_MOUSE_BUTTON = 0;

/** An in-app link that keeps modified clicks (new tab, new window) working as normal links. */
export function NavLink({ to, onClick, ...anchorProps }: NavLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (event.defaultPrevented || isModifiedClick || event.button !== PRIMARY_MOUSE_BUTTON) return;
    event.preventDefault();
    navigate(to);
  };

  return <a href={to} onClick={handleClick} {...anchorProps} />;
}
