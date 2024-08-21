import { ReactNode } from 'react';

const UserLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="p-3">
            <main className="flex-grow-1">
                {children}
            </main>
        </div>
    );
};

export default UserLayout;
