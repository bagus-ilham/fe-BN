/**
 * Skip link — accessibility (WCAG 2.1)
 * Allows keyboard users and screen readers to skip navigation and access the main content.
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
    >
      Skip to content
    </a>
  );
}
