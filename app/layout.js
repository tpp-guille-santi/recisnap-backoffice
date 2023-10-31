/* eslint-disable @next/next/no-head-element */
import './globals.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/saga-green/theme.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="body bg-gray-200">
        <main className="block">{children}</main>
      </body>
    </html>
  );
}
