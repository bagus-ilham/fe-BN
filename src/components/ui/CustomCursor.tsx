'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

function detectTouchDevice(): boolean {
  if (typeof window === "undefined") return true;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    ((navigator as any).msMaxTouchPoints && (navigator as any).msMaxTouchPoints > 0)
  );
}

export default function CustomCursor() {
  const [isTouchDevice] = useState<boolean>(() => detectTouchDevice()); // Hindari setState di effect
  const [isHovering, setIsHovering] = useState(false);
  const [isOverInput, setIsOverInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hasInitializedRef = useRef(false);

  // Animasi spring yang cepat dan responsif
  // Disetel agar tetap luwes tanpa terasa terlalu "magnetik"
  const springConfig = { damping: 30, stiffness: 600, mass: 0.25 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    // Jika perangkat sentuh, hentikan proses
    if (isTouchDevice) return;

    // Fungsi untuk memeriksa elemen input/textarea/editable
    const isInputElement = (element: HTMLElement | null): boolean => {
      if (!element) return false;

      // Periksa tag
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        return true;
      }

      // Periksa contenteditable
      if (element.hasAttribute('contenteditable') && element.getAttribute('contenteditable') !== 'false') {
        return true;
      }

      // Periksa apakah berada di dalam input/textarea
      if (element.closest('input, textarea, [contenteditable="true"]')) {
        return true;
      }

      return false;
    };

    const cursorCache = new WeakMap<Element, string>();

    // Fungsi untuk memeriksa apakah elemen interaktif/dapat diklik
    const isInteractiveElement = (element: HTMLElement | null): boolean => {
      if (!element || element === document.body || element === document.documentElement) {
        return false;
      }

      // Abaikan elemen milik custom cursor
      if (element.closest('[data-custom-cursor]')) {
        return false;
      }

      // Telusuri tree DOM hingga menemukan elemen interaktif
      let current: HTMLElement | null = element;
      let depth = 0;
      const maxDepth = 10; // Batas kedalaman agar tidak loop tak berujung

      while (current && depth < maxDepth) {
        // Abaikan elemen milik cursor itu sendiri
        if (current.hasAttribute('data-custom-cursor')) {
          current = current.parentElement;
          depth++;
          continue;
        }

        // Periksa tag HTML interaktif (kecuali INPUT/TEXTAREA yang ditangani terpisah)
        const interactiveTags = ['A', 'BUTTON', 'SELECT', 'LABEL'];
        if (interactiveTags.includes(current.tagName)) {
          // Periksa apakah elemen tidak dinonaktifkan
          if (current.hasAttribute('disabled') || current.getAttribute('aria-disabled') === 'true') {
            current = current.parentElement;
            depth++;
            continue;
          }
          return true;
        }

        // Periksa role interaktif
        const role = current.getAttribute('role');
        if (role && ['button', 'link', 'menuitem', 'tab', 'option'].includes(role)) {
          return true;
        }

        // Periksa cursor pointer (cache untuk menghindari reflow dari getComputedStyle)
        try {
          let cursorValue = cursorCache.get(current);
          if (cursorValue === undefined) {
            cursorValue = window.getComputedStyle(current).cursor;
            cursorCache.set(current, cursorValue);
          }
          if (cursorValue === 'none') {
            current = current.parentElement;
            depth++;
            continue;
          }
          if (cursorValue === 'pointer' || cursorValue === 'grab') {
            if (current.hasAttribute('disabled') || current.getAttribute('aria-disabled') === 'true') {
              current = current.parentElement;
              depth++;
              continue;
            }
            return true;
          }
        } catch {
          // Abaikan error style komputasi
        }

        // Periksa atribut interaktif
        if (
          current &&
          (
            current.hasAttribute('onclick') ||
            current.hasAttribute('href') ||
            (current.hasAttribute('tabindex') && current.getAttribute('tabindex') !== '-1')
          )
        ) {
          // Periksa apakah elemen tidak dinonaktifkan
          if (current.hasAttribute('disabled') || current.getAttribute('aria-disabled') === 'true') {
            current = current.parentElement;
            depth++;
            continue;
          }
          return true;
        }

        // Periksa apakah elemen klikable berdasarkan class
        const interactiveClasses = ['cursor-pointer', 'btn', 'button', 'link', 'clickable'];
        if (current && current.classList) {
          for (const className of interactiveClasses) {
            if (current.classList.contains(className)) {
              return true;
            }
          }
        }

        // Lanjut naik ke tree DOM
        if (current) {
          current = current.parentElement;
          depth++;
        } else {
          break;
        }
      }

      return false;
    };

    // Lacak posisi mouse dan deteksi hover
    const handleMouseMove = (e: MouseEvent) => {
      // Update posisi cursor secara langsung (kelancaran diatur useSpring)
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Tampilkan cursor saat mouse pertama kali bergerak
      if (!hasInitializedRef.current) {
        hasInitializedRef.current = true;
        setIsVisible(true);
      }

      // Deteksi elemen secara langsung
      try {
        // Periksa elemen di bawah cursor (tetap bekerja meski z-index tinggi)
        const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
        
        // Periksa apakah elemennya valid dan bukan cursor itu sendiri
        if (
          !elementUnderCursor || 
          elementUnderCursor === document.body || 
          elementUnderCursor === document.documentElement ||
          elementUnderCursor.closest('[data-custom-cursor]')
        ) {
          if (isHovering) {
            setIsHovering(false);
          }
          if (isOverInput) {
            setIsOverInput(false);
          }
          return;
        }

        // PERTAMA: periksa apakah input/textarea/editable (prioritas)
        const isInput = isInputElement(elementUnderCursor);
        if (isInput) {
          if (!isOverInput) {
            setIsOverInput(true);
          }
          if (isHovering) {
            setIsHovering(false);
          }
          return;
        } else {
          if (isOverInput) {
            setIsOverInput(false);
          }
        }

        // Periksa apakah interaktif (fungsi sudah menelusuri tree DOM)
        const isInteractive = isInteractiveElement(elementUnderCursor);

        if (isInteractive) {
          if (!isHovering) {
            setIsHovering(true);
          }
        } else {
          if (isHovering) {
            setIsHovering(false);
          }
        }
      } catch {
        // Jika terjadi error (elemen terhapus dari DOM, dll), reset ke state normal
        if (isHovering) {
          setIsHovering(false);
        }
        if (isOverInput) {
          setIsOverInput(false);
        }
      }
    };

    // Tambahkan listener - gunakan capture agar konsisten di semua elemen
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Deteksi mouse keluar jendela untuk reset
    const handleMouseLeave = () => {
      setIsVisible(false);
      if (isHovering) {
        setIsHovering(false);
      }
      if (isOverInput) {
        setIsOverInput(false);
      }
    };

    // Deteksi mouse masuk jendela untuk menampilkan cursor
    const handleMouseEnter = () => {
      if (hasInitializedRef.current) {
        setIsVisible(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });

    // JANGAN inisialisasi di tengah - ini menyebabkan efek "tertarik ke tengah"
    // Cursor hanya muncul setelah mouse bergerak pertama kali

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isHovering, isOverInput, isVisible, isTouchDevice]);

  // Jika perangkat sentuh, tidak perlu render
  if (isTouchDevice) return null;

  return (
    <motion.div
      data-custom-cursor
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: cursorX,
        y: cursorY,
      }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isOverInput ? 0 : (isVisible ? 1 : 0),
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Titik solid metallic gold - sedikit membesar saat hover */}
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: '#C9A961',
            boxShadow: '0 0 8px rgba(201, 169, 97, 0.4), 0 0 4px rgba(201, 169, 97, 0.6)',
          }}
          animate={{
            scale: isHovering ? 1.9 : 1,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
