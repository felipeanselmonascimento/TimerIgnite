import { useContext } from "react";
import { formatDistanceToNow } from "date-fns"
import { HistoryCointainer, HistoryList, Status } from "./styles";
import { CyclesContext } from "../../contexts/CyclesContext";

export function History() {

    const { cycles } = useContext(CyclesContext)

    return (
        <HistoryCointainer>
            <h1> My History </h1>
            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Duration</th>
                            <th>Start</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cycles.map(cycle => {
                            return (
                                <tr key={cycle.id}>
                                    <td>{cycle.task}</td>
                                    <td>{cycle.minutesAmount} minutes</td>
                                    <td>{formatDistanceToNow(cycle.startDate, {
                                        addSuffix: true
                                    })}</td>
                                    <td>
                                        {cycle.fineshedDate && (<Status statusColor="green"> Done </Status>)}

                                        {cycle.interruptedDate && (<Status statusColor="red"> Interrupted </Status>)}

                                        {(!cycle.fineshedDate && !cycle.interruptedDate) && (<Status statusColor="red"> in progress </Status>)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </HistoryList>
        </HistoryCointainer>
    )
}