import { useContext, useEffect, useState } from "react";
import { CountdownContainer, Separator } from "./style";
import { CyclesContext } from "../..";
import { differenceInSeconds } from "date-fns";

export function Countdown() {

    const { activeCycle, activeCycleId, markCurrentCicleAsFinished } = useContext(CyclesContext)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

    useEffect(() => {
        let interval: number

        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)

                if (secondsDifference >= totalSeconds) {
                    markCurrentCicleAsFinished()
                    setAmountSecondsPassed(totalSeconds)
                    clearInterval(interval)
                } else {
                    setAmountSecondsPassed(secondsDifference)
                }
            }, 1000)
        }
        return () => {         //use effect tem funcao de retorno caso sua dependecia tenha alteracao
            clearInterval(interval)
        }
    }, [activeCycle, totalSeconds, activeCycleId])

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


    return (
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>
    )
}