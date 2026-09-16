import { DisplayVideo } from '@/components/display/display-video';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ autostart?: string }>;
}

export default async function DisplayPage({ searchParams }: PageProps) {
    const { autostart } = await searchParams;

    return <DisplayVideo mediaUrls={["https://www.youtube.com/embed/wGA27zJEnaU?si=xl_eYYZgkDFDlxiQ"]} />;
}
