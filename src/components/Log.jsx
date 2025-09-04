import { useState } from "react";

export default function Log({ turns }) {
    return <ol id='log'>
        {turns.map(turn => {
            const row = turn.square.row;
            const column = turn.square.column;

            return <li key={`${row}${column}`}>{turn.player} selected {row},{column}</li>
        })}
    </ol>
}