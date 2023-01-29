import React, { useState } from 'react';
import PropTypes from "prop-types";
import { ListItemIcon, styled, Checkbox, Card, CardHeader, IconButton, Box, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { Link } from "react-router-dom";
import { format } from 'date-fns';

const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    color: "unset",
    ":hover": {
        color: theme.palette.primary.main
    }
}));

export default function GameStatListItem({ gamestat, handleConfirmDelete, handleUpdateWin }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    return <Card elevation={3}>
        <CardHeader sx={{
            pt: 1,
            pb: 1
        }}
        
            titleTypographyProps={{
                variant: "subtitle2"
            }}

            action={
                <Box>
                    <IconButton size="small" onClick={handleClick}>
                        <MoreVertIcon
                            fontSize="small"
                            id={`gamestat-card-action-${gamestat.id}`}
                            aria-controls={`gamestat-card-menu-${gamestat.id}`}
                            aria-expanded={`gamestat-card-menu-true-${gamestat.id}`}
                        />
                    </IconButton>

                    <Menu
                        id={`gamestat-card-action-menu-${gamestat.id}`}
                        aria-labelledby={`gamestat-card-action-${gamestat.id}`}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                    >
                        <MenuItem onClick={() => {
                            handleConfirmDelete(gamestat.id);
                        }}>
                            <ListItemIcon>
                                <DeleteOutlineIcon fontSize="small" />
                            </ListItemIcon>
                        </MenuItem>
                    </Menu>

                </Box>
            }

            title={
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Checkbox
                        sx={{ padding: (theme) => `0 ${theme.spacing(0.5)} 0 0` }}
                        checked={gamestat.win || false}
                        onClick={() => {
                            handleUpdateWin(gamestat);
                        }}
                    />

                    <StyledLink to={`/gamestat/edit/${gamestat.id}`} key={"gamestat-edit"}>
                        {gamestat.game_name} : {gamestat.game_type} 
                    </StyledLink>
                </Box>
            }
        />
        
        <h5>
            Start Time: {gamestat.start_time}
            <br/>
            End Time: {gamestat.end_time}
            <br/>
            <br/>
            Gameplay Description:
            <br/>
            {gamestat.description}
        </h5>
    </Card>;
}

GameStatListItem.propTypes = {
    gamestat: PropTypes.shape({
        id: PropTypes.number,
        game_name: PropTypes.string,
        game_type: PropTypes.string,
        description: PropTypes.string,
        win: PropTypes.bool,
    }),
    handleConfirmDelete: PropTypes.func,
    handleUpdateWin: PropTypes.func
};