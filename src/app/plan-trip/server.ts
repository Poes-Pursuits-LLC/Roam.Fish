'use server'

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { api } from '@clients/api.client'

export const submitTrip = async ({
    destinationId,
    destinationName,
    startDate,
    endDate,
    headCount,
}: {
    destinationId: number
    destinationName: string
    startDate: Date
    endDate: Date
    headCount: number
}) => {
    try {
        const { userId } = await auth()
        const response = await api.trip.submitTrip.mutate({
            destinationId,
            destinationName,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            headCount,
            userId: userId ?? null,
        })
        const {
            data: { tripId },
        } = response

        const user = await currentUser()
        if (user) {
            const client = await clerkClient()
            await client.users.updateUserMetadata(user.id, {
                privateMetadata: {
                    tripsPlanned: (user.privateMetadata?.tripsPlanned ?? 0) + 1,
                },
            })
        }

        return {
            tripId,
        }
    } catch (error) {
        console.error(error)
        throw new Error(error instanceof Error ? error.message : String(error))
    }
}
