import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountDownButton, StopCountDownButton } from "./styles";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { createContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Please Inform Task'),
    minutesAmount: zod.number().min(5).max(60)
})

type NewCycleFormDate = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    fineshedDate?: Date;
}

interface CyclesContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    markCurrentCicleAsFinished: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    

    const { handleSubmit, watch, reset } = useForm<NewCycleFormDate>({  //passar o mmouse sobre a funcao pra saber quando passar o generiics do ts
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',           //esse default e o valor inicial
            minutesAmount: 0
        }
        
    }) //useForm retorna um objeto e podemos usar a  destrruturacao
    //funcao register diz quais os campos q eu vou ter no meu formmulario

    //tbm e passado um objeto de configuracao no useForm

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    const markCurrentCicleAsFinished = () => {
        setCycles(state => state.map(cycle => {
            if (cycle.id == activeCycleId) {
                return { ...cycle, fineshedDate: new Date() }
            } else {
                return cycle
            }
        }))
    }

    

    const handleCreateNewCycle = (data: NewCycleFormDate) => {

        const id = String(new Date().getTime())

        const newCycle: Cycle = {   
            id,
            task: data.task,    
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        setCycles(state => [...state, newCycle])

        setActiveCycleId(id)
        setAmountSecondsPassed(0)

        reset() // volta para o valor q coloquei no defaultValue
    }

    const handleInterruptCycle = () => {

        setCycles(state => state.map(cycle => {
            if (cycle.id == activeCycleId) {
                return { ...cycle, interruptedDate: new Date()}
            } else {
                return cycle
            }
        }))

        setActiveCycleId(null)
    }

    
    

    const task = watch('task') // quero observar o campo task
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <CyclesContext.Provider value={{activeCycle, activeCycleId, markCurrentCicleAsFinished}}>
                    <NewCycleForm />
                    <Countdown />
                </CyclesContext.Provider>
                {activeCycle ? (
                    <StopCountDownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24} />
                        Stop
                    </StopCountDownButton>
                ) : (
                    <StartCountDownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Start
                    </StartCountDownButton>
                )}
            </form>
        </HomeContainer>
    )
}