import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { Inter } from 'next/font/google';
import '@/public/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import Footer from '@/components/Footer';
import StoreProvider from './StoreProvider';
import UserNavBar from '@/components/UserNavBar';
import AdminNavBar from '@/components/AdminNavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mobile Ecommerce',
  description: 'Made by Hiệp Vũ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('token');
  const role = cookies().get('role')?.value;

  let NavbarComponent = UserNavBar;
  if (token) {
    if (role === 'admin') {
      NavbarComponent = AdminNavBar;
    }
  }

  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${inter.className} d-flex flex-column min-vh-100`}>
          <NavbarComponent />
          <main className="flex-grow-1">{children}</main>
          <ToastContainer />
          <Footer />
        </body>
      </html>
    </StoreProvider>
  );
}