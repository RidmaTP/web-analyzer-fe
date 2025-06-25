import { service } from "../const";

export const startFetchingData = (
    link: string,
    setEventData: (data: any) => void,
    setError: (err: string | null) => void,
    setErrorCode: (errCode: number | null) => void,
    setLoading: (loading: boolean) => void,
    eventSourceObj: React.MutableRefObject<EventSource | null>
) => {
    if (!link) return alert('Please enter a URL');

    if (eventSourceObj.current) {
        eventSourceObj.current.close();
    }

    setEventData(null);
    setError(null);
    setLoading(true);

    const eventSource = new EventSource(`${service}?url=${encodeURIComponent(link)}`);
    eventSourceObj.current = eventSource;
    //response listener
    eventSource.onmessage = (event) => {
        try {
            //parsing
            const parsed = JSON.parse(event.data);

            if (parsed.error) {
                setError(parsed.error);
                setErrorCode(parsed.status_code);
                setLoading(false);
                if (eventSourceObj.current) {
                    eventSourceObj.current.close();
                    eventSourceObj.current = null;
                }
                return;
            }

            setEventData(parsed);
        } catch (err) {
            console.error('Invalid JSON:', event.data);
        }
    };
    //error listener
    eventSource.onerror = () => {
        console.error('connection error');
        if (eventSourceObj.current) {
            eventSourceObj.current.close();
            eventSourceObj.current = null;
        }
        setLoading(false);
    };
};
