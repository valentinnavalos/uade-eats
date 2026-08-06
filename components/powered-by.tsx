import { POWERED_BY } from "@/lib/constants";
import Link from "next/link";

export function PoweredBy() {
    return (
        <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <Link
                href={POWERED_BY.redirect}
                target="_blank"
                className="font-medium hover:text-accent"
            >
                {POWERED_BY.label}
            </Link>
        </p>
    )
}