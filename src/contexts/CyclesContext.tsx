import { ReactNode, createContext, useState, useReducer } from "react"

interface CreateCycleData {
    task: string
    minutesAmount: number
}

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    fineshedDate?: Date;
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    markCurrentCicleAsFinished: () => void
    amountSecondsPassed: number
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextsProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextsProviderProps) {
                                                    //action: qual acao o usuario ta querendo realizar dentro da nossa variavel
    const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
        if (action.type === 'CREATE_NEW_CYCLE') {
            return [...state, action.payload.newCycle]
        }
        return state
    }, [])

    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    
    const setSecondsPassed = (seconds: number) => {
        setAmountSecondsPassed(seconds)
    }

    const markCurrentCicleAsFinished = () => {
        // setCycles(state => state.map(cycle => {
        //     if (cycle.id == activeCycleId) {
        //         return { ...cycle, fineshedDate: new Date() }
        //     } else {
        //         return cycle
        //     }
        // }))

        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleId
            }
        })
    }

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    const createNewCycle = (data: CreateCycleData) => {

        const id = String(new Date().getTime())

        const newCycle: Cycle = {   
            id,
            task: data.task,    
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }
        //dispatch dispara a acao
        dispatch({
            type: 'CREATE_NEW_CYCLE',
            payload: {
                newCycle
            }
        })

        // setCycles(state => [...state, newCycle])

        setActiveCycleId(id)
        setAmountSecondsPassed(0)
    }

    const interruptCurrentCycle = () => {

        // setCycles(state => state.map(cycle => {
        //     if (cycle.id == activeCycleId) {
        //         return { ...cycle, interruptedDate: new Date()}
        //     } else {
        //         return cycle
        //     }
        // }))

        dispatch({
            type: 'INTERRUPT_CURRENT_CYCLE',
            payload: {
                activeCycleId
            }
        })

        setActiveCycleId(null)
    }
    
    return (
        <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCicleAsFinished, amountSecondsPassed, setSecondsPassed, createNewCycle, interruptCurrentCycle, cycles }}>
        { children }
        </CyclesContext.Provider>
    )
}

