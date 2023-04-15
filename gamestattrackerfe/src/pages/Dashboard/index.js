import React from 'react';

import GamesWinLose from './GamesWinLose';
import GameStatByGame from './Games';

export default function Dashboard() {
    return (
        <div>
            <GamesWinLose />
            <GameStatByGame />
        </div>
    )
}
