type DashboardFilterProps = {
    filterBy: string
    setFilter: (key: string) => void 
}

export default function DashboardFilter({filterBy, setFilter}: DashboardFilterProps) {
    return (
        <div className="flex flex-row border h-full w-full items-center justify-center">
            Filtering options will go here
        </div>
    )
}