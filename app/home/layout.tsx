import NavLinks from '@/app/ui/home/nav-links';

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav
        style={{
          padding: "1rem",
          background: "#f0f0f0",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: "1rem"
        }}
      >
        <NavLinks />
      </nav>
      <main>{children}</main>
    </div>
  );
}