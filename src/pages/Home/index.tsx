import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, Separator, StartCountDownButton, TaskInput, MinutesAmountInput } from "./styles";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

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

    useEffect(() => {
        if (activeCycle) {
            setInterval(() => {
                setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate))
            }, 1000)
        }
    }, [activeCycle])

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

        reset() // volta para o valor q coloquei no defaultValue
    }

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0') // preenche uma string ate um tamanho especifico
    const seconds = String(secondsAmount).padStart(2, '0')


    const task = watch('task') // quero observar o campo task
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor="task">I'm gonna start working in</label>
                    <TaskInput
                        id="task" 
                        list="task-suggestions"
                        placeholder="give a name to your work"
                        {...register('task')}
                        
                    />
                    <datalist id="task-suggestions">
                        <option value="projeto 1"></option>
                        <option value="projeto 2"></option>
                        <option value="projeto 3"></option>
                    </datalist>

                    <label htmlFor="minutesAmount">during</label>
                    <MinutesAmountInput
                        type="number"
                        id="minutesAmount"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        {...register('minutesAmount', { valueAsNumber: true })} //pode-se passar um segundo parametro q e um objeto de configuracao
                    />

                    <span>minutes.</span>
                </FormContainer>
                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>
                <StartCountDownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24} />
                    Start
                </StartCountDownButton>
            </form>
        </HomeContainer>
    )
}