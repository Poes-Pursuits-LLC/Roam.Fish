import { cn } from '~/lib/utils'
import { PlanTripAsync } from './PlanTrip.async'
import { MapPin, Navigation, Fish, Plane, Backpack, House } from 'lucide-react'
import UserBanner from '~/app/_components/UserBanner'
import SignupBanner from '~/app/trip/[id]/_components/SignUpBanner'
import { currentUser } from '@clerk/nextjs/server'

export const PlanTripPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ location: string | undefined }>
}) => {
    // *Data
    const initialDestination = (await searchParams).location ?? null
    const user = await currentUser()

    // *State
    const maxTripsPlanned = user
        ? Boolean(
              (user?.privateMetadata?.tripsPlanned ?? 0) >=
                  Number(process.env.FLAG_MAX_TRIPS_PLANNED!),
          )
        : false
    console.info(
        process.env.FLAG_MAX_TRIPS_PLANNED,
        user?.privateMetadata?.tripsPlanned,
        maxTripsPlanned,
    )

    return (
        <>
            {user ? (
                <UserBanner maxTripsPlanned={maxTripsPlanned} />
            ) : (
                <SignupBanner />
            )}
            <div className="relative min-h-screen pt-24 pb-16 px-4 bg-gray-50/20">
                <div
                    className={cn(
                        'absolute inset-0',
                        '[background-size:24px_24px]',
                        '[background-image:radial-gradient(rgba(185,28,28,0.2)_1.5px,transparent_1.5px)]',
                    )}
                />
                <div className="max-w-4xl mx-auto relative">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 text-gray-900">
                            Plan Your Perfect Fly Fishing Trip
                        </h1>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                            Complete the form below to start planning your next
                            fly fishing adventure. We&apos;ll help you find the
                            perfect location, flights, and accommodations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            {
                                icon: <MapPin className="h-6 w-6" />,
                                title: 'Top Destinations',
                                desc: 'Plan trips to the best fishing, faster.',
                            },
                            {
                                icon: <Navigation className="h-6 w-6" />,
                                title: 'Custom Itineraries',
                                desc: 'Personalized to your preferences.',
                            },
                            {
                                icon: <Plane className="h-6 w-6" />,
                                title: 'Flights',
                                desc: 'Forget the hassle of figuring out where to fly.',
                            },
                            {
                                icon: <Fish className="h-6 w-6" />,
                                title: 'Expert Guidance',
                                desc: 'Expert guidance on fishing your locale.',
                            },
                            {
                                icon: <House className="h-6 w-6" />,
                                title: 'Accommodations',
                                desc: 'Find lodging faster so you can focus on the fishing.',
                            },
                            {
                                icon: <Backpack className="h-6 w-6" />,
                                title: 'Packing List',
                                desc: 'Get a custom packing list that you can modify to save even more time.',
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="backdrop-blur-md bg-white/75 p-6 rounded-lg border shadow-lg text-center flex flex-col items-center hover:translate-y-[-5px] transition-transform duration-300"
                            >
                                <div className="bg-gradient-to-r from-[#0EA5E9] to-[#10B981] p-3 rounded-full mb-3 text-white">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-1">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-700 text-sm">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="backdrop-blur-md bg-white/75 rounded-xl overflow-hidden border shadow-lg">
                        <div className="flex flex-col gap-8 p-6 md:p-10">
                            <PlanTripAsync
                                initialDestination={initialDestination}
                                maxTripsPlanned={maxTripsPlanned}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
