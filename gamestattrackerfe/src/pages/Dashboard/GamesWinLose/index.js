import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';

import { Grid, Box } from "@mui/material";

import GamesIcon from '@mui/icons-material/Games';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloseIcon from '@mui/icons-material/Close';

import formatHttpApiError from 'src/helpers/formatHttpApiError';
import getCommonOptions from 'src/helpers/axios/getCommonOptions';
import StatCard from "./StatCard";

export default function GamesWinLose() {
    const [isLoading, setIsLoading] = useState(false);

    const [gameswinlose, setCompletionStats] = useState({
        win: null,
        lose: null
    });

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setIsLoading(true);
        
        axios.get('/gamewinlose/', getCommonOptions())
            .then((res) => {
                const { data } = res;
                
                if (data) {
                    const stats = {};
                    data.forEach(d => {
                        if (d.win === true) {
                            stats.win = d.count;
                            return;
                        }
                        if (d.win === false) {
                            stats.lose = d.count
                        }
                    })
                    setCompletionStats(stats);
                    setIsLoading(false);
                }
            }).catch((err) => {
                const formattedError = formatHttpApiError(err);
                enqueueSnackbar(formattedError);
                setIsLoading(false);
            })
    }, [enqueueSnackbar, setIsLoading])

    const totalGamesPlayed = (gameswinlose.win || 0) + (gameswinlose.lose || 0);

    return (
        <Box sx={{
            flexGrow: 1,
            mb: (theme) => theme.spacing(2)
        }}>
            <Grid container spacing={3}>
                <StatCard
                    title="Total Games Played"
                    value={totalGamesPlayed}
                    loading={isLoading}
                    icon={<GamesIcon fontSize="small" />}
                />

                <StatCard
                    title="Total Wins"
                    value={gameswinlose.win || 0}
                    loading={isLoading}
                    icon={<EmojiEventsIcon fontSize="small" />}
                />

                <StatCard
                    title="Total Lose"
                    value={gameswinlose.lose || 0}
                    loading={isLoading}
                    icon={<CloseIcon fontSize="small" />}
                />
            </Grid>
        </Box>
    )
}
