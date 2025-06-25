export const startFetchingData = (
    urlInput: string,
    setEventData: (data: any) => void,
    setError: (err: string | null) => void,
    setLoading: (loading: boolean) => void,
    eventSourceObj: React.MutableRefObject<EventSource | null>
) => {
    if (!urlInput) return alert('Please enter a URL');

    if (eventSourceObj.current) {
        eventSourceObj.current.close();
    }

    setEventData(null);
    setError(null);
    setLoading(true);

    const eventSource = new EventSource(`http://localhost:8000/api/result?url=${encodeURIComponent(urlInput)}`);
    eventSourceObj.current = eventSource;

    eventSource.onmessage = (event) => {
        try {
            const parsed = JSON.parse(event.data);

            if (parsed.error) {
                setError(parsed.error);
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

    eventSource.onerror = () => {
        console.error('SSE connection error');
        if (eventSourceObj.current) {
            eventSourceObj.current.close();
            eventSourceObj.current = null;
        }
        setLoading(false);
    };
};
