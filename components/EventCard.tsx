import Link from "next/link";
import Image from "next/image";
import {Event} from "@/app/type/event";

interface EventProps {
    event: Event;
}

const EventCards = ({event}: EventProps) => {
    return (
        <Link href={`/events`} id={'event-card'}>
            <Image src={event.image} alt={event.title} width={410} height={300} className={'poster'}/>
            <div className={'mt-4 space-y-4'}>
                <div className={'flex gap-2 items-center'}>
                    <Image src={'/icons/pin.svg'} alt={event.location} width={14} height={14}/>
                    <span className={'text-sm font-medium text-gray-300'}>{event.location}</span>
                </div>
                <p className={'title text-zinc-50'}>{event.title}</p>
                <div className={'flex items-center gap-4'}>
                    <div className={'flex items-center gap-2 border border-gray-400 rounded-lg px-2 py-0.5'}>
                        <Image src={'/icons/calendar.svg'} alt={event.location} width={14} height={14}/>
                        <span className={'text-gray-400'}>{event.date}</span>
                    </div>
                    <div className={'flex items-center gap-2 border border-gray-400 rounded-lg px-2 py-0.5'}>
                        <Image src={'/icons/clock.svg'} alt={event.location} width={14} height={14}/>
                        <span className={'text-gray-400'}>
                            {event.startTime}-{event.endTime}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCards;