import QueueDisplay from '@/components/display/queue-display';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ autostart?: string }>;
}

export default async function DisplayPage({ searchParams }: PageProps) {
    const { autostart } = await searchParams;

    return <QueueDisplay autostart={autostart === '1'} />;
}
