interface Dispatch<T> {
    (action: {(state: T): T}, props?): void
}

type Connect<T = any> = (
    mapProps?: (props: T) => T,
    mapDispatch?: (props: T) => T
) => (com: React.ComponentType<T>) => React.ComponentType<T>

export interface Middleware<T> {
    (state: T, nextState: T, props?): void
}

export interface Predux<T> {
    getState: {
        (): T
    }
    dispatch: Dispatch<T>
    connect: Connect
}

