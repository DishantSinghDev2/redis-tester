import type { Metadata } from 'next';

// --- SEO for Redis Connection Tester Page ---
// This metadata is highly targeted to users searching for this specific utility.
export const metadata: Metadata = {
  title: 'Online Redis Connection Tester', // A direct, searchable title
  description: 'Test your Redis server and database connections instantly online. A free, secure, and easy-to-use tool for developers to troubleshoot Redis connectivity issues from their browser.',
  
  // Specific keywords for this tool
  keywords: ["redis connection tester", "test redis online", "redis connectivity", "redis troubleshooting", "online redis client", "check redis connection", "redis debug"],

  // --- Overriding Open Graph and Twitter for this specific page ---
  openGraph: {
    title: 'Online Redis Connection Tester | DITools',
    description: 'A free, secure, and easy-to-use tool for developers to troubleshoot Redis connectivity issues from their browser.',
    // You could create a specific OG image for this tool for even better results
    // images: ['/og-redis-tester.png'],
  },
  twitter: {
    title: 'Online Redis Connection Tester | DITools',
    description: 'A free, secure, and easy-to-use tool for developers to troubleshoot Redis connectivity issues from their browser.',
    // images: ['/og-redis-tester.png'],
  },
};

export default function RedisToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout simply passes the children through, as the root layout
  // already contains the main HTML structure (body, fonts, etc.).
  // Its primary purpose here is to provide specific metadata for this route.
  return <div>{children}</div>;
}