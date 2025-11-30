interface PageProps {
    params: {
        email: string
    }
}

export default async function DashboardByEmail({ params }: PageProps) {
    const { email } = await params

    return (
        <div>
            <h1>Reports for {email}</h1>
        </div>
    );
}
