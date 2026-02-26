import Image from "next/image";
import {ExploreBtn} from "@/components/Exporebtn";
import EventCard from "@/components/EventCard";
import {events} from "@/app/lib/constants";

export default function Home() {
    return (
        <section>
            <h1 className={"text-center"}>Welcome to Next.js <br/> Programming you should Learn!</h1>
            <p className={'mt-4 text-center'}>Unlock all materials used in this video, plus full access to every JS
                Mastery
                course.</p>
            <ExploreBtn/>
            <div className={'mt-20 space-y-7'}>
                <h3>Feature Events</h3>
                <ul className={'events'}>
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}

                </ul>
            </div>
        </section>
    );
}
