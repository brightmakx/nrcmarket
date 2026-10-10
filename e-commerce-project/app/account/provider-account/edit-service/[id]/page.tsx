
import EditServiceForm from "./EditServiceForm";

export default async function EditServicePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <EditServiceForm serviceId={id} />
    );
}

