import { ReactNode, createContext, useState, useReducer } from "react"
import { ActionTypes, Cycle, cyclesReducer } from "../reducers/cycles"

interface CreateCycleData {
    task: string
    minutesAmount: number
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
    const [cycleState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null
    })

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { cycles, activeCycleId } = cycleState

    // const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    

    
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
            type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
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
            type: ActionTypes.CREATE_NEW_CYCLE,
            payload: {
                newCycle
            }
        })

        // setCycles(state => [...state, newCycle])

        // setActiveCycleId(id)
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
            type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
            payload: {
                activeCycleId
            }
        })

        // setActiveCycleId(null)
    }
    
    return (
        <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCicleAsFinished, amountSecondsPassed, setSecondsPassed, createNewCycle, interruptCurrentCycle, cycles }}>
        { children }
        </CyclesContext.Provider>
    )
}

