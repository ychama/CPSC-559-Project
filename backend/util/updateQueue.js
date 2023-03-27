import { EventEmitter } from 'node:events';

class Update {
    constructor (timeStamp, payload, isClient) {

        this.timeStamp = timeStamp;
        this.payload = payload;
        this.isClient = isClient;
    }
}

class UpdateQueue extends EventEmitter {

    constructor() {
        super();
        this.queue = [];
    }
    
    isEmpty() {
        return this.queue.length == 0;
    }

    enqueue(timeStamp, payload, isClient) {

        var update = new Update(timeStamp, payload, isClient);
        var added = false;
        const wasEmpty = this.isEmpty();

        for(var i = 0; i < this.queue.length; i++) {

            // lowest timestamp goes first
            if(this.queue[i].timeStamp > timeStamp) {

                this.queue.splice(i, 0, update);
                added = true;
                break;
            }
        }

        if (!added) {
            this.queue.push(update);
        }

        if(wasEmpty){
            this.emit('pendingUpdate');
        }
    }

    dequeue() {

        if(this.isEmpty()) 
            return "Underflow";
        return this.queue.shift();
    }

    front() {
        if(this.isEmpty())
            return "No Elements in Queue"
        return this.queue[0];
    }

    rear() {
        if(this.isEmpty())
            return "No Elements in Queue"
        return this.queue[queue.length - 1];
    }
}

export {
    Update,
    UpdateQueue,
};
