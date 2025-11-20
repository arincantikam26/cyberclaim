// components/Layout/Sidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
  HomeIcon,
  DocumentArrowUpIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  UserIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  HeartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  group?: string;
}

const navigation: NavigationItem[] = [
  // Dashboard Group
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, group: "main" },

  // Claims Management Group
  {
    name: "Upload Klaim",
    href: "/claim",
    icon: DocumentArrowUpIcon,
    group: "claims",
  },
  {
    name: "Validasi Klaim",
    href: "/validation",
    icon: DocumentCheckIcon,
    group: "claims",
  },
  {
    name: "Verifikasi BPJS",
    href: "/verification",
    icon: UserGroupIcon,
    group: "claims",
  },
  {
    name: "Fraud Detection",
    href: "/fraud",
    icon: ShieldCheckIcon,
    group: "claims",
  },

  // Master Data Group
  {
    name: "Tindakan (ICD-9)",
    href: "/tindakan",
    icon: DocumentCheckIcon,
    group: "master-data",
  },
  {
    name: "Diagnosa (ICD-10)",
    href: "/diagnose",
    icon: HeartIcon,
    group: "master-data",
  },
  {
    name: "Tarif Tindakan",
    href: "/tarif",
    icon: ChartBarIcon,
    group: "master-data",
  },
  {
    name: "Faskes",
    href: "/faskes",
    icon: BuildingOfficeIcon,
    group: "master-data",
  },
  {
    name: "Dokter",
    href: "/doctor",
    icon: UserCircleIcon,
    group: "master-data",
  },
  { name: "Pasien", href: "/patient", icon: UserIcon, group: "master-data" },

  // Administration Group
  { name: "Manajemen User", href: "/users", icon: UserIcon, group: "admin" },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon, group: "admin" },
  { name: "Update Profile", href: "/profile", icon: CogIcon, group: "admin" },
];

const groupConfig = {
  main: { name: "Main", defaultOpen: false },
  claims: { name: "Manajemen Klaim", defaultOpen: false },
  "master-data": { name: "Data Master", defaultOpen: false },
  admin: { name: "Administrasi", defaultOpen: false },
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [userInteracted, setUserInteracted] = useState<Record<string, boolean>>(
    {}
  );
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Initialize open groups
  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    const initialInteractedState: Record<string, boolean> = {};

    // Set all groups to their default state
    Object.keys(groupConfig).forEach((key) => {
      initialOpenState[key] =
        groupConfig[key as keyof typeof groupConfig].defaultOpen;
      initialInteractedState[key] = false;
    });

    setOpenGroups(initialOpenState);
    setUserInteracted(initialInteractedState);
  }, []);

  // Auto-open group that contains active route (only if user hasn't manually interacted)
  useEffect(() => {
    const activeGroup = findActiveGroup(pathname);

    if (activeGroup && !userInteracted[activeGroup]) {
      setOpenGroups((prev) => ({
        ...prev,
        [activeGroup]: true,
      }));
    }
  }, [pathname, userInteracted]);

  // Function to find which group contains the active route
  const findActiveGroup = (currentPath: string): string | null => {
    for (const item of navigation) {
      if (item.group && isItemActive(item, currentPath)) {
        return item.group;
      }
    }
    return null;
  };

  // Improved active item detection
  const isItemActive = (item: NavigationItem, currentPath: string) => {
    if (item.href === "/dashboard") {
      return currentPath === "/dashboard";
    }

    // For nested routes, check if current path starts with item href
    if (item.href !== "/dashboard" && currentPath.startsWith(item.href)) {
      return true;
    }

    return currentPath === item.href;
  };

  // Group navigation items by group
  const groupedNavigation = useMemo(() => {
    const groups: Record<string, NavigationItem[]> = {};

    navigation.forEach((item) => {
      const group = item.group || "ungrouped";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
    });

    return groups;
  }, []);

  const toggleGroup = (group: string) => {
    setUserInteracted((prev) => ({
      ...prev,
      [group]: true,
    }));

    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const getNavigationItemClass = (isActive: boolean) => {
    return `
      group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
      ${
        isActive
          ? "bg-white bg-opacity-20 text-black shadow-lg border-l-4 border-blue-400"
          : "text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-black hover:border-l-4 hover:border-blue-300"
      }
    `;
  };

  const getGroupHeaderClass = (group: string) => {
    const isOpen = openGroups[group];
    const hasActiveItem = groupedNavigation[group]?.some((item) =>
      isItemActive(item, pathname)
    );

    return `
      flex items-center justify-between w-full px-3 py-3 text-xs font-semibold uppercase tracking-wider
      transition-colors duration-200 rounded-lg cursor-pointer group
      ${
        hasActiveItem
          ? "text-blue-500 bg-white bg-opacity-15"
          : isOpen
          ? "text-blue-500 bg-white bg-opacity-5"
          : "text-blue-300 hover:text-blue-500 hover:bg-white hover:bg-opacity-5"
      }
    `;
  };

  // Reset user interaction when changing routes (optional)
  useEffect(() => {
    // You can choose to reset interactions on route change if desired
    // setUserInteracted(prev => {
    //   const reset = { ...prev };
    //   Object.keys(reset).forEach(key => {
    //     reset[key] = false;
    //   });
    //   return reset;
    // });
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-green-900 
        transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        overflow-hidden
      `}
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-center h-16 px-4 bg-white bg-opacity-10">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
            <span className="text-white text-xl font-bold">CyberClaim</span>
          </div>
        </div>

        {/* Navigation Container with Scroll */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6 px-3">
            {Object.entries(groupedNavigation).map(([group, items]) => {
              const groupInfo = groupConfig[group as keyof typeof groupConfig];
              const hasActiveItem = items.some((item) =>
                isItemActive(item, pathname)
              );
              const isOpen = openGroups[group];

              return (
                <div key={group} className="space-y-2">
                  {/* Group Header */}
                  {groupInfo && (
                    <button
                      onClick={() => toggleGroup(group)}
                      className={getGroupHeaderClass(group)}
                    >
                      <span className="flex items-center">
                        {hasActiveItem && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                        )}
                        {groupInfo.name}
                        {hasActiveItem && !isOpen && (
                          <span className="ml-2 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            (active)
                          </span>
                        )}
                      </span>
                      <div className="flex items-center">
                        {hasActiveItem && (
                          <div className="w-1 h-4 bg-blue-400 rounded-full mr-2"></div>
                        )}
                        {isOpen ? (
                          <ChevronUpIcon className="h-4 w-4 transition-transform" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 transition-transform" />
                        )}
                      </div>
                    </button>
                  )}

                  {/* Group Items */}
                  <div
                    className={`space-y-1 transition-all duration-300 ${
                      !isOpen ? "hidden" : "block"
                    }`}
                  >
                    {items.map((item) => {
                      const isActive = isItemActive(item, pathname);

                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          className={getNavigationItemClass(isActive)}
                          onClick={(e) => {
                            // Close mobile sidebar when item is clicked
                            if (window.innerWidth < 1024) {
                              onClose();
                            }
                          }}
                        >
                          <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>

                          {/* Active Indicator Dot */}
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* User Footer - Fixed at Bottom */}
        <div className="flex-shrink-0 border-t border-blue-700 bg-blue-800 bg-opacity-50">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Admin User
                </p>
                <p className="text-xs text-blue-200 truncate">
                  admin@cyberclaim.com
                </p>
                <p className="text-xs text-green-300 font-medium mt-1">
                  Super Admin
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            
            <div className="mt-4 pt-4 border-t border-blue-500/30">
              <div className="grid grid-cols-2 gap-3">
                {/* Profile Button */}
                <a
                  href="/profile"
                  className="flex items-center justify-center space-x-2 px-3 py-2.5 text-sm text-blue-100 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                >
                  <UserCircleIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Profile</span>
                </a>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 px-3 py-2.5 text-sm text-red-100 hover:text-white rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRightOnRectangleIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>Logout</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
