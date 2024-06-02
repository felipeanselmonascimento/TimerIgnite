import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountDownButton, StopCountDownButton } from "./styles";
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useContext } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Please Inform Task'),
    minutesAmount: zod.number().min(5).max(60)
})

type NewCycleFormDate = zod.infer<typeof newCycleFormValidationSchema>


export function Home() {

    const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)

    const newCycleForm = useForm<NewCycleFormDate>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',           //esse default e o valor inicial
            minutesAmount: 0
        }
        
    })

    const { handleSubmit, watch } = newCycleForm

    const task = watch('task') // quero observar o campo task
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(createNewCycle)}>
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />
                {activeCycle ? (
                    <StopCountDownButton onClick={interruptCurrentCycle} type="button">
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