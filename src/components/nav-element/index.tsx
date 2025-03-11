import Link from 'next/link';
import Text from '../Text';
import { cn } from '../../utils';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

type NavElementProps = {
    label: string;
    href: string;
    as?: string;
    scroll?: boolean;
    chipLabel?: string;
    disabled?: boolean;
    navigationStarts?: () => void;
};

const NavElement = ({
    label,
    href,
    as,
    scroll,
    disabled,
    navigationStarts = () => {},
}: NavElementProps) => {
    const router = useRouter();
    const isActive = href === router.asPath || (as && as === router.asPath);

    return (
        <Link
            href={href}
            as={as}
            scroll={scroll}
            passHref
            className={cn(
                'group flex h-full flex-col items-center justify-center btn-ghost rounded-btn',
                disabled && 'pointer-events-none cursor-not-allowed opacity-50',
            )}
            onClick={() => navigationStarts()}
        >
            <div className="flex flex-row items-center gap-1 px-2 py-1 "> {/* Reduced gap between items */}
                <Text
                    variant="nav-heading"
                    className={cn( // Smaller text size
                        isActive
                            ? 'text-white bg-gradient-to-l bg-fuchsia-600/20 px-2 py-1 rounded-btn' // Highlight effect for active link
                            : 'text-secondary', // Default and hover styles
                    )}
                >
                    {label}
                </Text>
            </div>
        </Link>
    );
};

export default NavElement;