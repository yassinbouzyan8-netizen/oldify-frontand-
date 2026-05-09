export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">{children}</div>
  );
}
