import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogoLight, LogoIcon } from "../../assets";
import { MenuLinks, type MenuItem } from "../../static/menu";
import { hasPermission } from "@/utils/permissions";
import { useDecodedAuth } from "@/hooks/useDecodedAuth";
import type { MerchantRoleEnum } from "@/enums/merchant.enum";
import Dropdown from "./Dropdown";
import VerifyPaymentModal from "../modals/VerifyPaymentModal";

interface prop {
  collapsed: boolean;
}
const Menu = ({ collapsed }: prop) => {
  const [expandedItems, setExpandedItems] = useState(new Set(["analytics"]));
  const navigate = useNavigate();
  const location = useLocation();

  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const {
    permissions: userPerms,
    user,
    role,
    organizationName,
  } = useDecodedAuth();

  const [isVerifyPaymentModalOpen, setIsVerifyPaymentModalOpen] = useState(false);

  const visibleMenus = MenuLinks.filter((menu) => {
    // Check permission first
    if (menu.perm && !hasPermission(userPerms, menu.perm)) {
      return false;
    }
    // Check role if specified
    if (menu.roles && menu.roles.length > 0) {
      return menu.roles.includes(role as MerchantRoleEnum);
    }
    // If no role restriction, show menu
    return true;
  }).map((menu) => ({
    ...menu,
    submenu: menu.submenu
      ? menu.submenu.filter((sub) => {
          // Check permission first
          if (sub.perm && !hasPermission(userPerms, sub.perm)) {
            return false;
          }
          // Check role if specified
          if (sub.roles && sub.roles.length > 0) {
            return sub.roles.includes(role as MerchantRoleEnum);
          }
          // If no role restriction, show submenu
          return true;
        })
      : undefined,
  }));

  const implementedPaths = new Set([
    "",
    "dashboard",
    "statistics",
    "invoice",
    "transactions",
    "transfers",
    "settlements",
    "profile",
    "settings",
    "classes",
    "subclass",
    "students",
    "parents",
    "admin-accounts",
    "results",
    "subjects",
    "courses",
    "exams",
    "organizations",
    "groups",
    "business-profile",
    "sub-account",
    "activity-logs",
    "sessions",
  ]);

  const buildDashboardPath = (path: string) => {
    if (!path || path === "dashboard") return "/dashboard";
    return `/dashboard/${path}`;
  };

  const onMenuChanged = (hasSubmenu: boolean, path: string, itemId: string) => {
    if (!hasSubmenu) {
      const isImplemented = implementedPaths.has(path);
      if (!isImplemented) {
        // Unimplemented: keep current view
        return;
      }
      navigate(buildDashboardPath(path));
      return;
    }

    const newExandedItems = new Set(expandedItems);
    if (newExandedItems.has(itemId)) {
      newExandedItems.delete(itemId);
    } else {
      newExandedItems.add(itemId);
    }

    setExpandedItems(newExandedItems);
  };

  const removeExpandedItem = (itemId: string) => {
    const newExandedItems = new Set(expandedItems);
    if (newExandedItems.has(itemId)) {
      newExandedItems.delete(itemId);
    } else {
      newExandedItems.add(itemId);
    }

    setExpandedItems(newExandedItems);
  };

  useEffect(() => {
    if (collapsed) {
      setExpandedItems(new Set());
      return;
    }

    MenuLinks.forEach((menu) => {
      if (menu.submenu) {
        const menuBasePath = buildDashboardPath(menu.path);
        const hasActiveChild =
          menu.submenu.some((sub) => {
            const subPath = buildDashboardPath(sub.path);
            return (
              location.pathname === subPath ||
              location.pathname.startsWith(subPath + "/")
            );
          }) || location.pathname.startsWith(menuBasePath + "/");

        if (hasActiveChild) {
          setExpandedItems((prev) => new Set(prev).add(menu.id));
        }
      }
    });
  }, [location.pathname, collapsed]);
  return (
			<>
				{/* Logo */}
				<div className='p-4 border-b border-slate-200/50 dark:border-slate-700/50'>
					<div className='flex items-center space-x-3 justify-between'>
						<div className='flex items-center justify-center w-full'>
							{collapsed ? (
								<img
									src={LogoIcon}
									className='h-8 transition-all duration-300 ease-in-out'
									alt='SaukiPay Icon'
								/>
							) : (
								<img
									src={LogoLight}
									className='h-8 transition-all duration-300 ease-in-out'
									alt='SaukiPay Logo'
								/>
							)}
						</div>
					</div>
				</div>

				{/* Dynamic Menus */}
				<nav className='flex-1 p-4 space-y-2 overflow-y-auto mt-2'>
					{visibleMenus.map((menu: MenuItem, index: number) => {
						const menuBasePath = buildDashboardPath(menu.path);
						const isParentActive =
							menu.path === "dashboard"
								? location.pathname === menuBasePath
								: menu.submenu
								? menu.submenu.some((sub) => {
										const subPath = buildDashboardPath(sub.path);
										return (
											location.pathname === subPath ||
											location.pathname.startsWith(subPath + "/")
										);
								  }) || location.pathname.startsWith(menuBasePath + "/")
								: location.pathname === menuBasePath ||
								  location.pathname.startsWith(menuBasePath + "/");
						return (
							<div key={index} className=''>
								<button
									ref={(el) => {
										triggerRefs.current[menu.id] = el;
									}}
									onClick={() => onMenuChanged(!!menu.submenu, menu.path, menu.id)}
									className={`${
										isParentActive
											? "bg-primary shadow-lg text-white shadow-blue-500/25 transition-all duration-200"
											: "text-slate-600"
									} w-full flex items-center justify-between p-3 rounded-xl cursor-pointer`}>
									<div className='flex items-center space-x-3'>
										<menu.icon className='w-5 h-5' />
										<>
											{!collapsed && (
												<span className='ml-2 font-medium text-sm'>{menu.label}</span>
											)}

											{menu.badge && !collapsed && (
												<span className='px-2 py-1 bg-secondary text-xs font-medium text-white rounded-full'>
													{menu.badge}
												</span>
											)}
											{menu.count && !collapsed && (
												<span className='px-2 py-1 bg-slate-200 text-slate-600 text-xs font-medium rounded-full'>
													{menu.count}
												</span>
											)}
										</>
									</div>
									{menu.submenu && !collapsed && (
										<ChevronDown
											className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
												expandedItems.has(menu.id) ? "rotate-180" : "rotate-0"
											}`}
										/>
									)}
								</button>
								{collapsed && (
									<Dropdown
										triggerRef={{ current: triggerRefs.current[menu.id] }}
										placement='right'
										isOpen={expandedItems.has(menu.id)}
										onClose={() => removeExpandedItem(menu.id)}>
										<div className='px-4 py-3'>
											<h1 className='font-medium text-sm mb-3 border-b border-b-slate-100 pb-2'>
												{menu.label}
											</h1>
											{menu?.submenu?.map((sub, idx: number) => {
												const isImplemented = implementedPaths.has(sub.path);
												const to = isImplemented ? buildDashboardPath(sub.path) : "/#";
												const isSubActive =
													to !== "/#" &&
													(location.pathname === to ||
														location.pathname.startsWith(to + "/"));
												return (
													<button
														key={idx}
														type='button'
														onClick={() => {
															if (to !== "/#") {
																navigate(to);
															}
															removeExpandedItem(menu.id);
														}}
														className={`w-full py-1 text-sm transition-all mt-2 duration-200 text-left block hover:bg-slate-100 cursor-pointer ${
															isSubActive
																? "px-2 text-primary text-s border-l-2 border-l-primary"
																: "text-slate-600"
														}`}>
														{sub.label}
													</button>
												);
											})}
										</div>
									</Dropdown>
								)}
								{/* Sub Menu */}
								<AnimatePresence initial={false}>
									{menu.submenu && !collapsed && expandedItems.has(menu.id) && (
										<motion.div
											key='submenu'
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3, ease: "easeInOut" }}
											className='ml-[50px] overflow-hidden space-y-1'>
											{menu.submenu.map((sub, idx: number) => {
												const isImplemented = implementedPaths.has(sub.path);
												const to = isImplemented ? buildDashboardPath(sub.path) : "/#";
												const isSubActive =
													to !== "/#" &&
													(location.pathname === to ||
														location.pathname.startsWith(to + "/"));
												return (
													<button
														key={idx}
														type='button'
														onClick={() => {
															if (to !== "/#") {
																navigate(to);
															}
														}}
														className={`w-full py-1 text-sm transition-all mt-2 duration-200 text-left block hover:bg-slate-100 cursor-pointer ${
															isSubActive
																? "px-2 text-primary text-s border-l-2 border-l-primary"
																: "text-slate-600"
														}`}>
														{sub.label}
													</button>
												);
											})}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						);
					})}
				</nav>

				{/* Verify Payment Button */}
				<div className='px-4 py-2'>
					<button
						onClick={() => setIsVerifyPaymentModalOpen(true)}
						className={`w-full flex items-center ${
							collapsed
								? "justify-center px-2 py-3"
								: "justify-start px-3 py-2.5 space-x-3"
						} bg-primary hover:opacity-90 rounded-lg text-white text-sm font-medium transition-colors cursor-pointer`}
						title={collapsed ? "Verify Payment" : ""}>
						<ShieldCheck className='w-4 h-4 flex-shrink-0' />
						{!collapsed && <span>Verify Payment</span>}
					</button>
				</div>

				{/* User Profile */}
				<div
					className={`p-4 border-t border-slate-200/50 ${
						collapsed ? "flex justify-center" : "flex items-center"
					}`}>
					<div
						className={`flex items-center ${
							collapsed ? "p-2" : "space-x-3 p-3"
						} rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200`}>
						{user?.profileImage ? (
							<img
								src={user.profileImage}
								alt='profile'
								className={`${
									collapsed ? "w-8 h-8" : "w-10 h-10"
								} rounded-full ring-2 ring-blue-500 hover:ring-blue-600 transition-all duration-200 object-cover`}
								onError={(e) => {
									(e.target as HTMLImageElement).src = "/avatar.png";
								}}
							/>
						) : (
							<div
								className={`${
									collapsed ? "w-8 h-8" : "w-10 h-10"
								} rounded-full ring-2 ring-blue-500 hover:ring-blue-600 transition-all duration-200 bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-xs`}>
								{(user?.fullName || user?.name || "U").charAt(0).toUpperCase()}
							</div>
						)}
					</div>
					{!collapsed && (
						<div className='min-w-0 flex-1 ml-3'>
							<p className='text-xs font-medium text-slate-800 truncate'>
								{user?.fullName || user?.name || "User"}
							</p>
							<p className='text-[10px] text-slate-500 truncate'>
								{(role as string) || (user?.role as string) || "Role"}{" "}
								{organizationName ? `• ${organizationName}` : ""}
							</p>
						</div>
					)}
				</div>

				{/* Verify Payment Modal */}
				<VerifyPaymentModal
					isOpen={isVerifyPaymentModalOpen}
					onClose={() => setIsVerifyPaymentModalOpen(false)}
				/>
			</>
		);
};

export default Menu;
