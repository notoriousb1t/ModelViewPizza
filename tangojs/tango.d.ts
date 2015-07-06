declare module tango {
    interface IEvent {
        node?: Node;
        propertyPath?: string;
        oldValue?: any;
        newValue?: any;
        type?: string;
    }
    interface IEventListener {
        (evt: IEvent): void;
    }
    interface IObservable<T> {
        $dispose(): void;
        $el: HTMLElement;
        $model: T;
        $off(eventName: string, listener: Function): void;
        $on(eventName: string, listener: IEventListener): void;
        $trigger(eventName: string, evt?: IEvent): void;
    }
    module str {
        function contains(value: string, searchString: string): boolean;
        function split(value: string, delimiter: string): Array<string>;
        function startsWith(value: string, searchString: string, position?: number): boolean;
        function trim(value: string): string;
    }
    module obj {
        function isCollection(value: any): boolean;
        function isDefined(value: any): boolean;
        function isFunction(value: any): boolean;
        function isObject(value: any): boolean;
        function getProperty(root: any, propertyPath: string): any;
        function setProperty(root: any, propertyPath: any, value: any, thisArg?: any): boolean;
        function evaluate(root: any, expression: string, initialValue?: any): any;
    }
    module list {
        interface IItem<T> {
            (item: T, index: number): void;
        }
        interface IList<T> {
            [index: number]: T;
            length: number;
        }
        interface IFilter<T> {
            (item: T): boolean;
        }
        function each<T>(src: IList<T>, callback: IItem<T>): void;
        function eachRight<T>(src: IList<T>, callback: IItem<T>): void;
        function filter<T>(src: IList<T>, condition: IFilter<T>): IList<T>;
        function find<T>(src: IList<T>, condition: IFilter<T>): T;
        function has<T>(src: IList<T>, item: T): boolean;
        function hasAny<T>(src: IList<T>, condition: IFilter<T>): boolean;
        function hasEvery<T>(src: IList<T>, condition: IFilter<T>): boolean;
        function merge<T>(src: IList<T>, items: IList<T>): IList<T>;
        function toArray<T>(src: IList<T>): Array<T>;
    }
    module dom {
        function setValue(el: HTMLElement, value: any): void;
        function getValue(el: HTMLElement): any;
        function setText(el: HTMLElement, text: string): void;
        function getText(el: HTMLElement): string;
        function setHtml(el: HTMLElement, html: string): void;
        function getHtml(el: HTMLElement): string;
    }
    class Observer {
        private cache;
        on(eventName: string, listener: IEventListener): void;
        off(eventName: string, listener: Function): void;
        trigger(eventName: string, evt?: IEvent, sync?: boolean): void;
        dispose(): void;
    }
    class Observable<T> implements IObservable<T> {
        _events: Observer;
        $el: HTMLElement;
        $model: T;
        constructor(el: HTMLElement | string, model: T);
        $on(eventName: string, listener: IEventListener): void;
        $off(eventName: string, listener: Function): void;
        $trigger(eventName: string, evt?: IEvent): void;
        $dispose(): void;
        private _watch(propertyPath, root);
        private _bind();
        private _unbind();
        private _setupEvent(eventName, el$, evtListener, unregisterPredicate);
        private _setupOnEvent(attr$, parent$);
        private _setupConditionalClasses(attr$, parent$);
        private _setupValueBindings(attr, parent);
        private _setupTextBindings(attr, parent);
        private _setupHtmlBindings(attr, parent);
        private _setupPropertyBindings(attr$, parent$);
        private _setupTokens(node, $parent);
        private _setupNode(node, parent);
        private getMutationObserver(el$);
    }
    function bind<T>(el: HTMLElement | string, model: T): IObservable<T>;
}
