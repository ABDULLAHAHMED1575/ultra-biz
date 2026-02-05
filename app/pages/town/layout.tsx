import { TownProvider } from '@/app/pages/town/hooks/TownContext';

export default function TownLayout({
   children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TownProvider>
            {children}
        </TownProvider>
    );
}