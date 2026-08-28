import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// 🌸 Flower / Rose Icon (FarOha Brand Theme)
export const FlowerIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <path d="M12 7.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
    <path d="M12 21.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
    <path d="M19.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
    <path d="M9.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.8" />
  </svg>
);

// 🛒 Shopping Cart Icon
export const CartIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

// 🛍️ Shopping Bag Icon
export const BagIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// 📏 Ruler / Measuring Tape Icon
export const RulerIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <path d="M5 17h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" />
    <line x1="6" y1="7" x2="6" y2="11" />
    <line x1="10" y1="7" x2="10" y2="10" />
    <line x1="14" y1="7" x2="14" y2="11" />
    <line x1="18" y1="7" x2="18" y2="10" />
  </svg>
);

// 🎬 Video Play Icon
export const VideoIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

// ⚡ Lightning / Fast Buy Icon
export const LightningIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// 📷 Camera / Gallery Photo Icon
export const CameraIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

// 📋 Clipboard / Copy Icon
export const CopyIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// 📱 Phone / Mobile Icon
export const PhoneIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

// 📍 Map Pin / Location Icon
export const LocationIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// 💳 Credit Card / Payment Icon
export const CreditCardIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

// 🚀 Rocket / Fast Order Icon
export const RocketIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5L16.5 6.5c1.5-1.5 1.5-4 1.5-4s-2.5 0-4 1.5L4.5 16.5z" />
    <path d="M12 9l3 3" />
    <path d="M9 12l3 3" />
  </svg>
);

// 🔍 Search / Inspect Icon
export const SearchIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// 🔒 Lock / Trust Badge Icon
export const LockIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// 🎁 Celebration / Reward Gift Icon
export const PartyIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <path d="M20 12V8H4v4" />
    <path d="M2 12h20" />
    <path d="M12 2v20" />
    <path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z" />
  </svg>
);

// 💬 Chat / WhatsApp Message Icon
export const ChatIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// ✉️ Mail / Contact Form Icon
export const MailIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

// 🕒 Clock / Working Hours Icon
export const ClockIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// 🚚 Truck / Shipping Icon
export const TruckIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

// 🔄 Refresh / Return Policy Icon
export const RefreshIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

// ✓ Check Circle Icon
export const CheckCircleIcon = ({ size = 20, style, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-primary)', ...style }}
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// 💬 Official WhatsApp Icon
export const WhatsAppIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.587 1.961.95 2.796.95 3.179 0 5.767-2.587 5.767-5.766.001-3.187-2.575-5.77-5.767-5.77zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.067-2.029-.485-1.503-.622-2.502-2.148-2.576-2.247-.075-.1-1.2-1.602-1.2-3.057 0-1.455.762-2.17.1.033-2.467.271-.297.592-.371.79-.371.198 0 .396.002.57.01.184.009.43-.07.673.513.248.594.846 2.063.92 2.212.074.149.124.322.025.52-.099.198-.149.322-.297.495-.149.173-.313.386-.447.519-.148.149-.303.311-.13.608.173.297.771 1.272 1.654 2.059 1.134 1.011 2.09 1.324 2.387 1.472.297.149.471.124.644-.074.173-.198.743-.866.941-1.163.198-.297.396-.248.669-.149.272.099 1.733.817 2.03.966.297.149.495.223.569.347.075.124.075.718-.069 1.123z"/>
    <path d="M12.042 2c-5.512 0-9.99 4.478-9.99 9.99 0 1.763.459 3.486 1.332 5.006l-1.384 5.004 5.163-1.349c1.471.802 3.129 1.229 4.879 1.229 5.512 0 9.99-4.478 9.99-9.99 0-5.512-4.478-9.99-9.99-9.99zm0 18.283c-1.517 0-3.007-.409-4.309-1.183l-.309-.184-3.208.838.855-3.097-.202-.322c-.852-1.355-1.303-2.927-1.303-4.545 0-4.667 3.797-8.464 8.467-8.464 4.667 0 8.464 3.797 8.464 8.464 0 4.668-3.797 8.464-8.464 8.464z"/>
  </svg>
);

// 📸 Official Instagram Icon
export const InstagramIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// 📘 Official Facebook Icon
export const FacebookIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
