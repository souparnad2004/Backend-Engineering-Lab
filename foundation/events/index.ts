import { EventEmitter } from 'node:events';

// 1. Create an emitter, register a listener, and emit an event.
const emitter = new EventEmitter();
emitter.on('greet', (name: string) => {
  console.log(`Hello, ${name}!`);
});
emitter.emit('greet', 'Rahul');

// 2. Multiple listeners can respond to one event (registration order).
type User = { id: string; email: string };
emitter.on('user:created', (user: User) => {
  console.log('Email notification for:', user.email);
});

emitter.on('user:created', (user: User) => {
  console.log('Audit log for user:', user.id);
});

emitter.emit('user:created', { id: 'u1', email: 'user@example.com' });

// 3. once() executes only for the first matching emission.
emitter.once('connected', () => console.log('Connected for the first time'));
emitter.emit('connected');
emitter.emit('connected'); // No output.

// 4. off() removes a specific listener by its original function reference.
function onMessage(message: string) {
  console.log('Message:', message);
}
emitter.on('message', onMessage);
emitter.emit('message', 'First');
emitter.off('message', onMessage);
emitter.emit('message', 'Second'); // No output.

// 5. emit() returns true if at least one listener exists, otherwise false.
console.log('Has greet listeners?', emitter.emit('greet', 'Again'));
console.log('Has missing listeners?', emitter.emit('missing'));

// 6. Listeners are invoked synchronously by emit().
console.log('Before sync event');
emitter.on('sync', () => console.log('Inside sync listener'));
emitter.emit('sync');
console.log('After sync event');

// 7. Async listeners are NOT awaited by emit().
emitter.on('async-task', async () => {
  console.log('Async task started');
  try {
    await new Promise<void>((resolve) => setTimeout(resolve, 100));
    console.log('Async task finished');
  } catch (error) {
    console.error('Async task failed:', error);
  }
});
emitter.emit('async-task');
console.log('emit() already returned');

// 8. The "error" event is special: without an error listener,
//    emitting it throws (and may crash the process if uncaught).
emitter.on('error', (error: Error) => console.error('Handled error:', error.message));
emitter.emit('error', new Error('Example failure'));

// 9. Inspect listener counts and event names.
console.log('greet listener count:', emitter.listenerCount('greet'));
console.log('Registered event names:', emitter.eventNames());

/**
 * Quick method reference:
 * on(name, fn)               -> register recurring listener
 * once(name, fn)             -> register one-time listener
 * emit(name, ...args)        -> invoke listeners; returns boolean
 * off(name, fn)              -> remove a particular listener
 * removeListener(name, fn)   -> alias for off()
 * removeAllListeners(name)   -> remove all listeners for an event
 * listenerCount(name)        -> number of listeners for an event
 * eventNames()               -> names of registered events
 * prependListener(name, fn)  -> register listener at beginning
 * setMaxListeners(n)         -> change warning threshold (default 10)
 *
 * Important:
 * - EventEmitter events are local to the current Node.js process.
 * - emit() does not await async listeners or guarantee delivery/retries.
 * - Register shared listeners once, usually during app startup.
 * - Remove temporary listeners to prevent memory leaks.
 * - Use queues for durable background processing.
 */
