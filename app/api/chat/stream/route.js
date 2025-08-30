import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const client = await clientPromise;
      const db = client.db();
      
      // Función para enviar datos
      const sendData = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Enviar mensaje de conexión
      sendData({ type: 'connected', message: 'Conectado al chat' });

      // Función para obtener mensajes
      const fetchMessages = async () => {
        try {
          const messages = await db.collection('messages')
            .find({})
            .sort({ createdAt: -1 })
            .limit(100)
            .toArray();
          
          sendData({ type: 'messages', data: messages.reverse() });
        } catch (error) {
          console.error('Error al obtener mensajes:', error);
        }
      };

      // Obtener mensajes iniciales
      await fetchMessages();

      // Polling cada 2 segundos (más eficiente que antes)
      const interval = setInterval(async () => {
        await fetchMessages();
      }, 2000);

      // Limpiar intervalo cuando se cierre la conexión
      return () => {
        clearInterval(interval);
      };
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
}
