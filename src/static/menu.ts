import { BarChart, Calendar, Code, CreditCard, LayoutDashboard, MessageCircle, Settings, Store, Users, User, Shield, MoreVertical, UserCheck, ClipboardList, Briefcase, Logs, CalendarDays, type LucideIcon } from 'lucide-react';
import type { MerchantRoleEnum } from '@/enums/merchant.enum';
import { MerchantRoles } from '@/enums/merchant.enum';

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
  active?: boolean;
  badge?: string;
  count?: string;
  roles?: MerchantRoleEnum[];
  perm?: string | null;
  submenu?: Array<{
    id: string;
    label: string;
    path: string;
    icon?: LucideIcon;
    roles?: MerchantRoleEnum[];
    perm?: string;
  }>;
}

export const MenuLinks: MenuItem[] = [
  {
    id: '1',
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: 'dashboard',
    active: true,
    badge: 'New',
    perm: null,
  },

  {
    id: '2',
    icon: BarChart,
    label: 'Analytics',
    active: false,
    path: 'analytics',
    perm: 'stakeHolder.read',
    submenu: [
      { id: 'overview', label: 'Overview', path: 'overview' },
      { id: 'report', label: 'Report', path: 'report' },
      { id: 'insights', label: 'Insights', path: 'insights' },
    ],
  },
  {
    id: '3',
    icon: User,
    label: 'Users',
    active: false,
    count: '2.4k',
    path: 'users',
    perm: 'stakeHolder.read',
    submenu: [
      { id: 'all-users', label: 'All Users', path: 'users' },
      { id: 'roles', label: 'Role & Permissions', path: 'permissions' },
      { id: 'activity', label: 'User Activity', path: 'activity' },
    ],
  },
  {
    id: '4',
    icon: Users,
    label: 'Students Hub',
    active: false,
    path: 'student-hub',
    perm: 'student.read',
    submenu: [
      { id: 'students', label: 'Students', path: 'students', icon: Users, perm: 'student.read' },
      { id: 'classes', label: 'Classes', path: 'classes', icon: MoreVertical, perm: 'student.read' },
    ],
  },
  {
    id: '5',
    icon: CreditCard,
    label: 'Transactions',
    active: false,
    count: '2.4k',
    path: 'transactions',
    perm: 'fees.read',
    submenu: [
      { id: 'invoice', label: 'Invoice', path: 'invoice', perm: 'fees.read' },
      { id: 'transfers', label: 'Transfers', path: 'transfers', perm: 'fees.read' },
      { id: 'transactions', label: 'Transactions', path: 'transactions', perm: 'fees.read' },
      { id: 'settlements', label: 'Settlements', path: 'settlements', perm: 'fees.read' },
    ],
  },
  {
    id: '5.5',
    icon: UserCheck,
    label: 'Parents',
    active: false,
    path: 'parents',
    perm: 'parent.read',
  },
  {
    id: '5.6',
    icon: Shield,
    label: 'Admin Accounts',
    active: false,
    path: 'admin-accounts',
    perm: 'staff.read',
  },
  {
    id: '5.7',
    icon: ClipboardList,
    label: 'Results Manager',
    active: false,
    path: 'results',
    perm: 'results.read',
    submenu: [
      { id: 'subjects', label: 'Subjects', path: 'subjects', perm: 'results.read' },
      { id: 'courses', label: 'Courses', path: 'courses', perm: 'results.read' },
      { id: 'results', label: 'Results', path: 'results', perm: 'results.read' },
      { id: 'exams', label: 'Exams', path: 'exams', perm: 'results.read' },
    ],
  },
  {
    id: '6',
    icon: Store,
    label: 'Organizations', 
    path: 'organizations',
    active: false,
    perm: 'organization.read',
    roles: [MerchantRoles.PORTAL_ADMIN],
    submenu: [
      { id: 'groups', label: 'Groups', path: 'groups', perm: 'organization.read', roles: [MerchantRoles.PORTAL_ADMIN] },
      { id: 'merchants-list', label: 'Organizations', path: 'organizations', perm: 'organization.read', roles: [MerchantRoles.PORTAL_ADMIN] }, // Changed from 'merchants' to 'organizations'
    ],
  },
  {
    id: '6.5',
    icon: Briefcase,
    label: 'Business',
    active: false,
    path: 'business',
    perm: 'organization.read',
    roles: [MerchantRoles.ORG_ADMIN, MerchantRoles.GROUP_ADMIN], 
    submenu: [
      { id: 'business-profile', label: 'Business Profile', path: 'business-profile', perm: 'organization.read', roles: [MerchantRoles.ORG_ADMIN, MerchantRoles.GROUP_ADMIN] },
      { id: 'sub-account', label: 'Sub Account', path: 'sub-account', perm: 'organization.read', roles: [MerchantRoles.ORG_ADMIN, MerchantRoles.GROUP_ADMIN] },
    ],
  },
  {
    id: '7',
    icon: Calendar,
    label: 'Calendar',
    path: 'calendar',
    active: false,
    perm: 'stakeHolder.read',
  },
  {
    id: '7.5',
    icon: CalendarDays,
    label: 'Sessions',
    path: 'sessions',
    active: false,
    perm: null,
  },
  {
    id: '8',
    icon: MessageCircle,
    label: 'Messages',
    count: '11.4k',
    path: 'message',
    active: false,
    perm: 'stakeHolder.read',
  },
  {
    id: '9',
    icon: Settings,
    label: 'Setting',
    path: 'settings',
    active: false,
    perm:'stakeHolder.read'
  },
  {
    id: '10',
    icon: Code,
    label: 'API Library',
    path: 'api',
    active: false,
    perm: 'stakeHolder.read',
  },
  {
    id: '11',
    icon: Logs,
    label: 'Activity Logs',
    active: false,
    path: 'activity-logs',
    perm: null,
  },
];
