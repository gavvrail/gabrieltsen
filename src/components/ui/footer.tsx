
import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full py-6 px-4 md:px-6 border-t border-border bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <Link href="#" className="hover:text-foreground transition-colors">
                        Twitter
                    </Link>
                    <Link href="#" className="hover:text-foreground transition-colors">
                        GitHub
                    </Link>
                    <Link href="#" className="hover:text-foreground transition-colors">
                        LinkedIn
                    </Link>
                </div>
            </div>
        </footer>
    );
}
