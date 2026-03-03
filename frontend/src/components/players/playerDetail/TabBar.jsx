export const TABS = [
  { id: "overview", label: "Overview" },
  { id: "scout", label: "Scout Report" },
  { id: "career", label: "Career" },
  { id: "competitions", label: "Competitions" },
  { id: "analytics", label: "Analytics" },
];

const TabBar = ({ active, setActive }) => (
  <nav className="flex overflow-x-auto gap-0 scrollbar-none">
    {TABS.map((t) => (
      <button
        key={t.id}
        onClick={() => setActive(t.id)}
        className={`
          px-5 py-3.5 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px
          transition-colors duration-150 focus:outline-none
          ${
            active === t.id
              ? "border-[#C4161C] text-white"
              : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
          }
        `}
      >
        {t.label}
      </button>
    ))}
  </nav>
);

export default TabBar;
