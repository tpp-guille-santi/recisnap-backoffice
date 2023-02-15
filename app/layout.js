/* eslint-disable @next/next/no-head-element */
import './globals.css';
import '../styles/recisnap-theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="body bg-gray-200">
        <main className="block">{children}</main>
      </body>
    </html>
  );
}
