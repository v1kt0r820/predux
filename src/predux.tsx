import * as React from "react"
const h = React.createElement

export interface Dispatch<T> {
    (action: {(state: T): T}, props?): void
}

export type Connect<T = any> = (
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

export const isSameObject = (obj1, obj2) => {
    let keys1 = Object.keys(obj1)
    let keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
        return false
    } else if (keys1.length + keys2.length === 0) {
        return true
    }
    return keys1.every(k => obj1[k] === obj2[k])
}

export default (middlewares?: Middleware<any>[]) => (initState = {}): Predux<any> => {
    let store = initState
    let updateQueue: Function[] = []
    const connect: Connect<any> = (mapProps, mapDispatch) => (Com) => class extends React.Component<any, any> {
        props
        state
        tempProps
        tempUpdate
        execProps() {
            const { props } = this
            const res1 = mapProps(props)
            let res2 = {}
            if (mapDispatch) {
                res2 = mapDispatch(Object.assign({}, props, res1))
            }
            return Object.assign({}, props, res1, res2)
        }
        constructor(props) {
            super(props)
            let t = this
            t.execProps = t.execProps.bind(t)
            t.tempProps = t.execProps()
            t.tempUpdate = function () {
                let newProps = t.execProps()
                if (!isSameObject(t.tempProps, newProps)) {
                    t.tempProps = newProps
                    t.forceUpdate && t.forceUpdate()
                }
            }
            updateQueue.push(t.tempUpdate)
        }
        componentWillUnmount() {
            updateQueue.splice(updateQueue.indexOf(this.tempUpdate), 1)
        }
        render() {
            return <Com {...this.tempProps} {...this.props}/>
        }
    }
    return {
        connect,
        getState: () => store,
        dispatch: (action, props) => {
            let res = action(store)
            middlewares && middlewares.map(middleware => middleware(store, res, props))
            if (res !== store) {
                store = res
                updateQueue.map(f => f())
            }
        }
    }
}