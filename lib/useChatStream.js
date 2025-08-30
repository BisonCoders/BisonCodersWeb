import { useEffect, useState, useRef } from 'react';

export function useChatStream() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/chat/stream');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('Conectado al stream de chat');
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connected') {
          console.log(data.message);
        } else if (data.type === 'messages') {
          setMessages(data.data);
        }
      } catch (error) {
        console.error('Error al procesar mensaje SSE:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Error en SSE:', error);
      setIsConnected(false);
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return { messages, isConnected };
}
