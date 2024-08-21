import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AdminLayout = ({ children }: { children: ReactNode }) => {
    const token = cookies().get('token');
    const role = cookies().get('role')?.value;

    if (!token || role !== 'admin') {
        redirect('/login');
    }

    return (
        <div className="p-3">
            <main className="flex-grow-1">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;