import React, { useEffect, useMemo } from "react";
import {
    FormControl,
    Box,
    InputLabel,
    Select,
    MenuItem,
    Button,
    TextField,
} from "@mui/material";
import { Formik } from "formik";
import PropTypes from "prop-types";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import useRequestResource from "src/hooks/useRequestResource";

const winorloseFilters = [
    {
        label: "All",
        value: "all"
    },
    {
        label: "Lose",
        value: "False"
    },
    {
        label: "Win",
        value: "True"
    },
];

const initialValues = {
    win: "all",
    id: "all",
    search: "",
};

export default function Filters({ onSubmit }) {
    const { getResourceList, resourceList } = useRequestResource({ endpoint: "game" });

    const handleSubmit = (values) => {
        onSubmit(values);
    };

    useEffect(() => {
        getResourceList();
    }, [getResourceList]);

    const gamesList = useMemo(() => {
        return [{
            value: "all",
            label: "All"
        }].concat(resourceList.results.map(r => {
            return {
                value: r.id,
                label: r.name
            }
        }))
    }, [resourceList.results])

    const theme = useTheme();
    const isBelowMedium = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            enableReinitialize
        >
            {(formik) => {
                return (
                    <form onSubmit={formik.handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <FormControl
                                sx={{
                                    width: isBelowMedium ? "100%" : 160,
                                    marginRight: (theme) => theme.spacing(1),
                                    marginBottom: (theme) => theme.spacing(2),
                                }}
                                variant="outlined"
                            >
                                <TextField
                                    size="small"
                                    id="title"
                                    label="Title"
                                    type="search"
                                    {...formik.getFieldProps("search")}
                                />
                            </FormControl>

                            <FormControl
                                sx={{
                                    width: isBelowMedium ? "100%" : 160,
                                    marginRight: (theme) => theme.spacing(1),
                                    marginBottom: (theme) => theme.spacing(2),
                                }}
                                variant="outlined"
                            >
                                <InputLabel id="games-label">Games</InputLabel>
                                <Select
                                    labelId="games-label"
                                    label="Games"
                                    id="filter-games"
                                    size="small"
                                    {...formik.getFieldProps("id")}
                                >
                                    {gamesList.map((c) => {
                                        return (
                                            <MenuItem value={c.value} key={c.value}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >

                                                    <Box sx={{ ml: c.color ? 1 : 0 }}>{c.label}</Box>
                                                </Box>
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>

                            <FormControl
                                sx={{
                                    width: isBelowMedium ? "100%" : 160,
                                    marginRight: (theme) => theme.spacing(1),
                                    marginBottom: (theme) => theme.spacing(2),
                                }}
                                variant="outlined"
                            >
                                <InputLabel id="winorlose-label">Win OR Lose</InputLabel>
                                <Select
                                    labelId="winorlose-label"
                                    label="WinOrLose"
                                    id="filter-winorlose"
                                    size="small"
                                    {...formik.getFieldProps("win")}
                                >
                                    {winorloseFilters.map((c) => {
                                        return (
                                            <MenuItem value={c.value} key={c.value}>
                                                <div style={{ display: "flex" }}>{c.label}</div>
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>

                            <Box sx={{ marginBottom: (theme) => theme.spacing(2) }}>
                                <Button
                                    type="submit"
                                    size="medium"
                                    variant="contained"
                                    color="primary"
                                >
                                    Search
                                </Button>
                            </Box>
                        </Box>
                    </form>
                );
            }}
        </Formik>
    );
}

Filters.propTypes = {
    onSubmit: PropTypes.func,
};
