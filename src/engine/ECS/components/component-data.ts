type Constructor<T> = { new (...args: any[]): T};

export class ComponentData {
    name: string;

    constructor(type: Constructor<any>) {
        this.name = type.name;
    }

}