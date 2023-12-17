import { FormContainer, MinutesAmountInput, TaskInput } from "./style";


export function NewCycleForm () {
    return (
        <FormContainer>
                    <label htmlFor="task">I'm gonna start working in</label>
                    <TaskInput
                        id="task" 
                        list="task-suggestions"
                        placeholder="give a name to your work"
                        disabled={!!activeCycle}
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
    )
}