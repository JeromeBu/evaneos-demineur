import React from 'react';

const buildGameStyle = (
    gameOver: GameProps['gameOver']
): React.CSSProperties => {
    const conditionalStyles = gameOver
        ? {
              border: `2px solid ${gameOver === 'defeat' ? 'red' : 'green'}`,
          }
        : {
              border: `2px solid blue`,
          };
    return {
        padding: '10px 15px',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '10px',
        borderRadius: '10px',
        fontFamily: 'sans-serif',
        fontSize: '20px',
        fontWeight: 'lighter',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...conditionalStyles,
    };
};

type GameProps = {
    gameOver: false | 'victory' | 'defeat';
    cancelLastShot: () => void;
    score: number;
};

const actionButton: React.CSSProperties = {
    cursor: 'pointer',
};

const scoreStyle: React.CSSProperties = {
    color: 'red',
    fontWeight: 'bolder',
};

export const Game: React.FunctionComponent<GameProps> = ({
    gameOver,
    cancelLastShot,
    score,
}) => {
    const displayedText = !gameOver
        ? 'Jeu en cours'
        : gameOver === 'victory'
        ? 'Gagné !'
        : 'Boom ! Vous avez perdu !';

    return (
        <div style={buildGameStyle(gameOver)}>
            <div>{displayedText}</div>
            <div style={scoreStyle}>{score}</div>
            <div style={actionButton} onClick={cancelLastShot}>
                <img src="/previous.svg" width="20px" />
            </div>
        </div>
    );
};
