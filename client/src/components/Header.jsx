export default function Header() {
  const headerStyle = {
    backgroundColor: "#7b3728",
    color: "white",
    padding: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const responsiveStyle = {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    flexWrap: "wrap",
  };

  return (
    <header className="bg-white shadow-md py-4 px-8">
      <div className="flex items-center justify-between">
        {/* Logo and Title as a link */}
        <a
          href="https://bdaorg.com/"
          className="flex items-center gap-3 ml-[30px] no-underline"
        >
          <img src="../Logo-1.png" alt="Logo" className="h-12 w-auto" />
          <h1 className="text-xl font-bold text-gray-800">
            Bharat Dietetic Association
          </h1>
        </a>
      </div>
    </header>
  );
}
