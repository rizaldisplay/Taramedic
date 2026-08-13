import { Home, CalendarDays, Plus, Users, Settings } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';

const leftTabs = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/antrean', label: 'Antrean', icon: CalendarDays },
];

const rightTabs = [
  { path: '/pasien', label: 'Pasien', icon: Users },
  { path: '/pengaturan', label: 'Pengaturan', icon: Settings },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) =>
    location === path || (path === '/dashboard' && location === '/');

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-2px_12px_rgba(30,58,95,0.08)]"
      data-testid="bottom-nav"
    >
      <div className="flex items-end justify-around px-2 pb-3 pt-1 max-w-lg mx-auto">
        {/* Left tabs */}
        {leftTabs.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              href={path}
              data-testid={`nav-${label.toLowerCase()}`}
              className="flex flex-col items-center gap-1 px-3 py-1 relative min-w-[56px]"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-1 bg-primary rounded-full"
                />
              )}
              <motion.div
                whileTap={{ scale: 0.82 }}
                className={`w-6 h-6 flex items-center justify-center ${active ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className={`text-[10px] font-medium leading-none ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </Link>
          );
        })}

        {/* FAB center button */}
        <div className="flex flex-col items-center" style={{ marginTop: '-20px' }}>
          <motion.button
            data-testid="nav-fab-pendaftaran"
            whileTap={{ scale: 0.90 }}
            onClick={() => setLocation('/pendaftaran')}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40"
          >
            <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Right tabs */}
        {rightTabs.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              href={path}
              data-testid={`nav-${label.toLowerCase()}`}
              className="flex flex-col items-center gap-1 px-3 py-1 relative min-w-[56px]"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-1 bg-primary rounded-full"
                />
              )}
              <motion.div
                whileTap={{ scale: 0.82 }}
                className={`w-6 h-6 flex items-center justify-center ${active ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className={`text-[10px] font-medium leading-none ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
