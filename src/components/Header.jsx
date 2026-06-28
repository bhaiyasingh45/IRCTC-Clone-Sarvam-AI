export default function Header() {
  return (
    <header className="bg-navy text-white w-full shadow-md" style={{ height: 56 }}>
      <div className="max-w-screen-xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span className="text-irctc-orange font-bold text-xl tracking-wider">IRCTC</span>
            <span className="text-blue-200 text-xs tracking-wide">Indian Railway</span>
          </div>
          <div className="h-8 w-px bg-blue-400 opacity-50 mx-2" />
          <nav className="flex items-center gap-6 text-sm">
            <a href="#" className="text-white hover:text-irctc-orange transition-colors font-medium">Train</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Hotel</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Flight</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Tourism</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">Holiday</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-blue-200 hover:text-white transition-colors">Register</button>
          <button className="bg-irctc-orange hover:bg-orange-600 text-white text-sm font-medium px-4 py-1.5 rounded transition-colors">
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
