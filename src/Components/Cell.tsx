import React from 'react';
import { CellStatus } from '../Domain/Cell';

type CellProps = {
    status: CellStatus;
    bombsAround: number;
    onclick: Function;
    isDark: boolean;
};

const emojis: { [key in CellStatus]: string } = {
    untouched: '',
    dug: '',
    flagged: '🚩',
    detonated: '💥',
};

const notDugDark = '#9ad0fe';
const notDugLight = '#85c7ff';
const dugDark = '#fdf5e6';
const dugLight = '#f0eee9';

const cellStyle = (
    status: CellStatus,
    isDark: boolean
): React.CSSProperties => {
    const notDugColor = isDark ? notDugDark : notDugLight;
    const dugColor = isDark ? dugDark : dugLight;
    return {
        width: '40px',
        height: '40px',
        fontFamily: 'sans-serif',
        fontSize:
            status === 'detonated' || status === 'flagged' ? '2rem' : '1rem',
        fontWeight: 'lighter',
        textAlign: 'center',
        lineHeight: '40px',
        boxSizing: 'border-box',
        cursor: 'pointer',
        backgroundColor:
            status === 'untouched' || status === 'flagged'
                ? notDugColor
                : dugColor,
    };
};

export const Cell: React.FC<CellProps> = ({
    bombsAround,
    onclick,
    status,
    isDark,
}) => (
    <div
        onClick={ev => {
            ev.preventDefault();
            onclick(ev);
        }}
        onContextMenu={ev => {
            ev.preventDefault();
            onclick(ev);
        }}
        style={cellStyle(status, isDark)}
    >
        {status === 'dug' && bombsAround > 0
            ? bombsAround.toString()
            : emojis[status]}
    </div>
);
