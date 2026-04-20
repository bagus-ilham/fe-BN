'use client';

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';

interface DropdownMenuItem {
  label?: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  separator?: boolean;
}

interface DropdownMenuProps {
  children: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
  /** Rótulo para leitores de tela (obrigatório quando o trigger é apenas ícone) */
  ariaLabel?: string;
}

function DropdownMenu({
  children,
  items,
  align = 'right',
  ariaLabel = 'Abrir menu',
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Memoisasi handler
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = useCallback(async () => {
    // Impor dan gunakan fungsi logout terpusat
    const { handleLogout: logout } = await import('@/utils/auth');
    setIsOpen(false); // Tutup menu sebelum logout
    await logout();
  }, []);

  const handleItemClick = useCallback(async (item: DropdownMenuItem) => {
    // Jika item adalah "Sair", lakukan logout tanpa navigasi
    if (item.label === 'Sair') {
      setIsOpen(false);
      await handleLogout();
      return;
    }

    // Abaikan item tanpa label (separator sudah ditangani)
    if (!item.label) {
      return;
    }

    if (item.onClick) {
      item.onClick();
    }
    
    if (item.href) {
      router.push(item.href);
    }
    
    setIsOpen(false);
  }, [router, handleLogout]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggle}
        className="focus:outline-none focus:ring-2 focus:ring-brand-green/20 rounded-full transition-opacity hover:opacity-80"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={ariaLabel}
      >
        {children}
      </button>

      {isOpen && (
        <>
          {/* Overlay untuk menutup saat klik di luar */}
          <div
            className="fixed inset-0 z-10"
            onClick={handleClose}
          />

          {/* Menu dropdown */}
          <div
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-2 z-20 w-56 bg-white rounded-sm shadow-lg border border-gray-200 py-2`}
            role="menu"
          >
            {items.map((item, index) => {
              if (item.separator) {
                return (
                  <div
                    key={`separator-${index}`}
                    className="my-1 border-t border-gray-100"
                  />
                );
              }

              const handleClick = () => {
                handleItemClick(item);
              };

              // Lewati item tanpa label (kecuali separator)
              if (!item.label) {
                return null;
              }

              return (
                <button
                  key={index}
                  onClick={handleClick}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-left text-xs uppercase tracking-[0.2em] font-light text-brand-softblack hover:bg-gray-50 transition-colors"
                  role="menuitem"
                >
                  {item.icon && (
                    <span className="w-4 h-4 flex-shrink-0 text-gray-400">
                      {item.icon}
                    </span>
                  )}
                  <span className={item.icon ? '' : 'pl-7'}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Memoisasi komponen DropdownMenu
export default memo(DropdownMenu);
