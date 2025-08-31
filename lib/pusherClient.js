import PusherClient from 'pusher-js';

const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || 'd266bb12deb94a5d6dc5', {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us3',
});

export default pusherClient;
