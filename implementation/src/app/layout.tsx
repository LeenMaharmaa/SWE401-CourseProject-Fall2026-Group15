import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'SkillBridge | Your next chapter', description: 'Understand the role. Recognize your strengths. Prepare with confidence.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
