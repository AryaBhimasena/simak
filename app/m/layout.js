// app/m/layout.js
import './globals.css'; // ini adalah app/m/globals.css

export const metadata = {
  title: 'My App - Mobile',
  description: 'Versi mobile aplikasi',
};

export default function MobileLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Bisa taruh Navbar / Bottom Navigation mobile di sini */}
        {children}
      </body>
    </html>
  );
}
