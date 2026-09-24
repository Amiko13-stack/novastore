import { BagIcon, HeartIcon } from "@/components/ui/icons";

export function AdminNavIcon({ index }: { index: number }) {
  if (index === 4) return <BagIcon />;
  if (index === 5) return <HeartIcon />;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {index === 0 && <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>}
    {index === 1 && <><path d="m12 3 9 5-9 5-9-5 9-5Z M3 8v9l9 5 9-5V8 M12 13v9 M7.5 5.5l9 5" /></>}
    {index === 2 && <><rect x="3" y="4" width="18" height="5" rx="1" /><rect x="3" y="14" width="18" height="6" rx="1" /><path d="M7 6.5h.01 M7 17h.01" /></>}
    {index === 3 && <><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>}
  </svg>;
}