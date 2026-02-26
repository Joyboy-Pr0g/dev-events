import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <header>
            <nav>
                <Link href={'/'} className={'flex items-center gap-2'}>
                    <Image src={'/icons/logo.png'} alt={'Logo'} width={24} height={24}/>
                    <p className={'text-lg font-semibold opacity-0 md:opacity-100'}>DevEvents</p>
                </Link>

                <ul>
                    <Link href={'/'}>Home</Link>
                    <Link href={'/events'}>Events</Link>
                    <Link href={'/create-event'}>Create Event</Link>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;