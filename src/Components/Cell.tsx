import React from 'react';
import { CellStatus } from '../Domain/Cell';

type CellProps = {
    status: CellStatus;
    minesAround: number;
    onclick: Function;
};

const emojis: { [key in CellStatus]: string } = {
    untouched: '',
    dug: '',
    flagged: '🚩',
    detonated: '💥',
};

const cellStyle = (status: CellStatus): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '40px',
    border: '1px solid black',
    boxSizing: 'border-box',
    cursor: 'pointer',
    backgroundColor:
        status === 'untouched' || status === 'flagged' ? '#ccc' : undefined,
});

export const Cell: React.FC<CellProps> = ({ minesAround, onclick, status }) => (
    <div
        onClick={ev => {
            ev.preventDefault();
            onclick(ev);
        }}
        onContextMenu={ev => {
            ev.preventDefault();
            onclick(ev);
        }}
        style={cellStyle(status)}
    >
        {status === 'dug' && minesAround > 0
            ? minesAround.toString()
            : emojis[status]}
    </div>
);
