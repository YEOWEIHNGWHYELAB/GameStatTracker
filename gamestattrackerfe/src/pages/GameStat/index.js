import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogTitle, Typography, Pagination } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import Masonry from "react-masonry-css";

import GameStatListItem from './GameStatListItem';
import useRequestResource from 'src/hooks/useRequestResource';
import Filters from "./Filters";

const pageSize = 6;
const breakpoints = {
    default: 3,
    1100: 2,
    700: 1
} 

export default function GameStat() {
    const { resourceList, getResourceList, deleteResource, updateResource } = useRequestResource({ endpoint: "gamestat", resourceLabel: "Game Statistics" });
    const [open, setOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    // Equals to a functions that accepts a task
    const handleUpdateWin = (gamestat) => {
        updateResource(gamestat.id, {
            win: !gamestat.win
        })
    }

    const handleConfirmDelete = (id) => {
        setIdToDelete(id);
        setOpen(true);
    }

    const handleDeleteClose = () => {
        setOpen(false);
    }

    const handleDelete = () => {
        setOpen(false);
        deleteResource(idToDelete);
    }

    const navigate = useNavigate();
    const location = useLocation();
    const query = queryString.parse(location.search);

    const handleChangePagination = (event, value) => {
        // When we switch pages, we will construct a new url and then go to it
        const newQuery = {
            ...query,
            page: value
        }
        const newSearch = queryString.stringify(newQuery);
        navigate(`${location.pathname}?${newSearch}`);
    }

    const onSubmitSearch = (values) => {
        const { completed, priority, search, category } = values;
        const newQuery = {
            completed: completed === "True" || completed === "False" ? completed : undefined,
            priority: priority === "all" ? undefined : priority,
            category: category === "all" ? undefined : category,
            search: search
        }

        const newSearch = queryString.stringify(newQuery);
        navigate(`${location.pathname}?${newSearch}`);
    }

    useEffect(() => {
        getResourceList({ query: location.search });
    }, [getResourceList, location.search])

    return (
        <div>
            <Dialog open={open} onClose={handleDeleteClose}>
                <DialogTitle>
                    Are you sure you want to delete this Task?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleDelete}>
                        YES, I want it GONE!
                    </Button>
                    <Button onClick={handleDeleteClose}>
                        NO, I wanna go back!
                    </Button>
                </DialogActions>
            </Dialog>

            <Filters onSubmit={onSubmitSearch} />
            <Typography
                variant="subtitle1"
                sx={{
                    marginLeft: (theme) => theme.spacing(1),
                    marginBottom: (theme) => theme.spacing(2)
                }}
                color="text.primary"
            >
                {`Total Game Statistics: ${resourceList.count || 0}`}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3, mt: 3 }}>
                <Button component={Link} variant="contained" color="primary" to="/gamestat/create">
                    Create Game Statistics
                </Button>
            </Box>

            <Masonry breakpointCols={breakpoints} className="my-masonry-grid" columnClassName='my-masonry-grid_column'>
                {resourceList.results.map((gamestat) => {
                    return (
                        <div key={gamestat.id}>
                            <GameStatListItem gamestat={gamestat} handleConfirmDelete={handleConfirmDelete} handleUpdateWin={handleUpdateWin} />
                        </div>
                    )
                })}
            </Masonry>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Pagination
                    color="primary"
                    count={Math.ceil(resourceList.count / pageSize)}
                    page={query.page ? parseInt(query.page) : 1}
                    onChange={handleChangePagination}
                />
            </Box>
        </div>
    )
}
