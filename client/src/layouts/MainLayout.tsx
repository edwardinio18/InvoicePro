import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { authApi } from "@/api/auth";
import {
  Menu,
  ChevronRight,
  Bell,
  LogOut,
  Search,
  Settings,
  Moon,
  Filter,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    authApi.logout();
    window.location.href = "/login";
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const handleClickOutside = () => {
    if (searchActive) {
      setSearchActive(false);
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gradient-to-t from-[#b8c3fa] to-[#dee2f7] lg:translate-x-0 transition-transform duration-200 ease-in-out
                   ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:flex-shrink-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex overflow-auto px-6 py-4 items-center justify-center text-center">
            <div className="bg-white py-3 px-6 rounded-lg w-full">
              <span className="text-xl font-bold text-[#aaaaa8]">LOGO</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-6 py-8">
            <p className="text-sm font-medium text-slate-800 mb-4">Menu</p>
            <nav className="space-y-2">
              <Link
                to="/"
                className={`flex items-center pl-9 py-2.5 text-sm font-medium rounded-md transition-colors 
                           ${
                             isActive("/")
                               ? "bg-white/40 text-slate-800"
                               : "text-slate-800 hover:bg-white/20"
                           }`}
                onClick={() => setSidebarOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/invoices"
                className={`flex items-center pl-4 pr-2 py-2.5 text-sm font-medium rounded-md transition-colors 
                           ${
                             isActive("/invoices")
                               ? "bg-white/40 text-slate-800"
                               : "text-slate-800 hover:bg-white/20"
                           }`}
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronRight className="h-4 w-4 opacity-70 mr-2" />
                Invoices
              </Link>
              <Link
                to="/bills"
                className={`flex items-center pl-4 pr-2 py-2.5 text-sm font-medium rounded-md transition-colors 
                           ${
                             isActive("/bills")
                               ? "bg-white/40 text-slate-800"
                               : "text-slate-800 hover:bg-white/20"
                           }`}
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronRight className="h-4 w-4 opacity-70 mr-2" />
                Bills
              </Link>
              <Link
                to="/expenses"
                className={`flex items-center pl-4 pr-2 py-2.5 text-sm font-medium rounded-md transition-colors
                           ${
                             isActive("/expenses")
                               ? "bg-white/40 text-slate-800"
                               : "text-slate-800 hover:bg-white/20"
                           }`}
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronRight className="h-4 w-4 opacity-70 mr-2" />
                Expenses
              </Link>
              <Link
                to="/reports"
                className={`flex items-center pl-4 pr-2 py-2.5 text-sm font-medium rounded-md transition-colors 
                           ${
                             isActive("/reports")
                               ? "bg-white/40 text-slate-800"
                               : "text-slate-800 hover:bg-white/20"
                           }`}
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronRight className="h-4 w-4 opacity-70 mr-2" />
                Reports
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-t from-[#b8c3fa] to-[#dee2f7] px-4 py-3">
        <div className="flex flex-col flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
          <header onClick={handleClickOutside}>
            <div className="flex h-16 items-center justify-between px-6 sm:px-8 border-b border-slate-200">
              <div className="flex items-center">
                <button
                  type="button"
                  className="text-slate-500 hover:text-slate-600 mr-3"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <span className="sr-only">Toggle sidebar</span>
                  <Menu className="h-5 w-5" />
                </button>

                <div className="hidden sm:flex items-center">
                  <Link
                    to="/"
                    className="text-sm text-[#c2c2c2] hover:text-slate-700"
                  >
                    Home
                  </Link>
                  {location.pathname.startsWith("/invoices") && (
                    <>
                      <span className="mx-2 text-[#cfcfcf]">/</span>
                      <span className="text-sm font-medium text-[#3d3d3d]">
                        Invoices
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className={`relative hidden md:block md:w-80 lg:w-96`}>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search"
                    className="w-full rounded-full border border-slate-200 bg-[#f3f3f3] pl-10 pr-10 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Filter className="h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="md:hidden relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-500 hover:text-slate-700 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchActive(!searchActive);
                    }}
                  >
                    <Search className="h-5 w-5" />
                  </Button>

                  {searchActive && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg z-50 p-2">
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="search"
                          placeholder="Search"
                          className="w-full rounded-full border border-slate-200 bg-[#f3f3f3] pl-10 pr-10 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <Filter className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-500 hover:text-slate-700 rounded-full"
                  >
                    <Bell className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-500 hover:text-slate-700 rounded-full"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-500 hover:text-slate-700 rounded-full"
                  >
                    <Moon className="h-5 w-5" />
                  </Button>
                </div>

                <div className="sm:hidden relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-500 hover:text-slate-700 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileMenuOpen(!mobileMenuOpen);
                    }}
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>

                  {mobileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg z-50 py-2 w-36">
                      <button className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </button>
                      <button className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </button>
                      <button className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                        <Moon className="h-4 w-4 mr-2" />
                        Theme
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto px-8 py-7">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
