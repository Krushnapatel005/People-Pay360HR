// Simple cn utility — joins truthy class strings
export function cn(...inputs: (string | undefined | null | false | 0)[]): string {
  return inputs.filter(Boolean).join(' ').trim();
}

// Format currency INR
export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(dateStr: string, opts?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opts,
  });
}

// Format date range
export function formatDateRange(from: string, to: string): string {
  return `${formatDate(from)} – ${formatDate(to)}`;
}

// Format hours
export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Relative time
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

// Truncate string
export function truncate(str: string, max = 40): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

// Status color map
export const STATUS_COLORS: Record<string, string> = {
  active:         'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  inactive:       'bg-slate-500/15 text-slate-400 border-slate-500/30',
  archived:       'bg-slate-500/15 text-slate-500 border-slate-500/30',
  on_leave:       'bg-amber-500/15 text-amber-400 border-amber-500/30',
  probation:      'bg-blue-500/15 text-blue-400 border-blue-500/30',
  terminated:     'bg-red-500/15 text-red-400 border-red-500/30',
  draft:          'bg-slate-500/15 text-slate-400 border-slate-500/30',
  pending:        'bg-amber-500/15 text-amber-400 border-amber-500/30',
  approved:       'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected:       'bg-red-500/15 text-red-400 border-red-500/30',
  cancelled:      'bg-slate-500/15 text-slate-500 border-slate-500/30',
  computed:       'bg-blue-500/15 text-blue-400 border-blue-500/30',
  validated:      'bg-violet-500/15 text-violet-400 border-violet-500/30',
  paid:           'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  expired:        'bg-orange-500/15 text-orange-400 border-orange-500/30',
  full_time:      'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  part_time:      'bg-sky-500/15 text-sky-400 border-sky-500/30',
  fixed_term:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
  internship:     'bg-pink-500/15 text-pink-400 border-pink-500/30',
  freelance:      'bg-teal-500/15 text-teal-400 border-teal-500/30',
};

