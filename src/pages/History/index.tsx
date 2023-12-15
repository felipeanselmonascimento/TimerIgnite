import { HistoryCointainer, HistoryList, Status } from "./styles";

export function History() {
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
                        <tr>
                            <td>task</td>
                            <td>20 min</td>
                            <td>há 2 meses</td>
                            <td>
                                <Status statusColor="green"> Done </Status>
                            </td>
                        </tr>
                        <tr>
                            <td>task</td>
                            <td>20 min</td>
                            <td>há 2 meses</td>
                            <td>
                                <Status statusColor="green"> Done </Status>
                            </td>
                        </tr>
                        <tr>
                            <td>task</td>
                            <td>20 min</td>
                            <td>há 2 meses</td>
                            <td>
                                <Status statusColor="green"> Done </Status>
                            </td>
                        </tr>
                        <tr>
                            <td>task</td>
                            <td>20 min</td>
                            <td>há 2 meses</td>
                            <td>
                                <Status statusColor="red"> Done </Status>
                            </td>
                        </tr>
                        <tr>
                            <td>task</td>
                            <td>20 min</td>
                            <td>há 2 meses</td>
                            <td>
                                <Status statusColor="yellow"> Done </Status>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </HistoryList>
        </HistoryCointainer>
    )
}