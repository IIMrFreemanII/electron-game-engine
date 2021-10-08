import EventEmitter from "eventemitter3";

export type ProfileResult = {
    name: string;
    time: number;
};

const emitter = new EventEmitter();

export class Profiler {
    public static data = new Map();

    public static profile(name: string, callback: () => void) {
        const start = performance.now();
        callback();
        const end = performance.now();
        const time = end - start;
        this.data.set(name, time);

        emitter.emit('profile', { name, time });
    }

    public static addListener(callback: (result: ProfileResult) => void) {
        emitter.addListener('profile', callback);
    }
    public static removeListener(callback: (result: ProfileResult) => void) {
        emitter.removeListener('profile', callback);
    }
}