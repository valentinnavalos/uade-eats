import Link from "next/link";

export function BuiltBy() {
    const BY = '@valentinnavalos'
    const BY_REDIRECT = 'https://github.com/valentinnavalos'
    return (
        <p className="text-sm text-muted-foreground">Built by <Link href={BY_REDIRECT} target="_blank" className="font-medium hover:text-accent">{BY}</Link></p>
    )
}