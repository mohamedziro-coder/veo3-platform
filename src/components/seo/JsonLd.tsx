type JsonLdValue =
    | string
    | number
    | boolean
    | null
    | JsonLdValue[]
    | { [key: string]: JsonLdValue };

interface JsonLdProps {
    id: string;
    data: JsonLdValue;
}

export default function JsonLd({ id, data }: JsonLdProps) {
    return (
        <script
            id={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
