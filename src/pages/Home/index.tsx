import { HandPalm, Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, Separator, StartCountDownButton, TaskInput, MinutesAmountInput, StopCountDownButton } from "./styles";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";

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

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormDate>({  //passar o mmouse sobre a funcao pra saber quando passar o generiics do ts
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',           //esse default e o valor inicial
            minutesAmount: 0
        }
        
    }) //useForm retorna um objeto e podemos usar a  destrruturacao
    //funcao register diz quais os campos q eu vou ter no meu formmulario

    //tbm e passado um objeto de configuracao no useForm

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

    useEffect(() => {
        let interval: number

        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)

                if (secondsDifference >= totalSeconds) {

                    setCycles(state => state.map(cycle => {
                        if (cycle.id == activeCycleId) {
                            return { ...cycle, fineshedDate: new Date()}
                        } else {
                            return cycle
                        }
                    }))
                    setAmountSecondsPassed(totalSeconds)
                    clearInterval(interval)

                } else {
                    setAmountSecondsPassed(secondsDifference)
                }

                
            }, 1000)
        }

        return  () => {         //use effect tem funcao de retorno caso sua dependecia tenha alteracao
            clearInterval(interval)
        }

    }, [activeCycle, totalSeconds, activeCycleId])

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

    
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0') // preenche uma string ate um tamanho especifico
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds])


    const task = watch('task') // quero observar o campo task
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <NewCycleForm />
                <Countdown />
                { activeCycle ? (
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