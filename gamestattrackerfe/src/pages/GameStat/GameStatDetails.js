import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Grid,
    Paper,
    Typography,
    Button
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import useRequestResource from "src/hooks/useRequestResource";
import DateTimePicker from 'react-datetime-picker';
import { DatePicker } from "@mui/lab";

const validationSchema = yup.object({
    game: yup.string().required("Game is required"),
    gametype: yup.string().required("Game type is required"),
    title: yup.string().required("Title is required").max(100, "Max length is 100"),
});

export default function GameStatDetails() {
    const { getResourceList, resourceList: gameList } = useRequestResource({
        endpoint: "game"
    })
    const { addResource, updateResource, getResource, resource } = useRequestResource({ 
        endpoint: "gamestat", 
        resourceLabel: "Game Statistics" 
    })

    const navigate = useNavigate();
    const { id } = useParams();

    // Set initial state of the form
    const [initialValues, setInitialValues] = useState({
        game: "",
        gametype: "",
        start_time: useState(Date.now()),
        end_time: useState(Date.now()),
        description: "",
    });

    useEffect(() => {
        getResourceList();
    }, [getResourceList]);

    useEffect(() => {
        if (id) {
            getResource(id);
        }
    }, [id, getResource]);

    useEffect(() => {
        if (resource) {
            setInitialValues({
                game: resource.game,
                gametype: resource.game_type || "",
                start_time: resource.start_time,
                end_time: resource.end_time,
                description: resource.description || "",
            })
        }
    }, [resource]);

    const handleDateChange = (currTimeDate) => {
        resource.end_time = currTimeDate;
    };

    const handleSubmit = (values) => {
        if (id) {
            updateResource(id, values, () => {
                navigate("/gamestat")
            })

            return;
        }

        addResource(values, () => {
            navigate("/gamestat")
        })
    };

    return (
        <Paper sx={{
            borderRadius: (theme) => theme.spacing(0.5),
            boxShadow: (theme) => theme.shadows[5],
            padding: (theme) => theme.spacing(3)
        }}>
            <Typography variant="h6" mb={4}>
                {id ? "Edit Game Statistics" : "Create Game Statistics"}
            </Typography>
            <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
            >
                {(formik) => {
                    return (
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormControl
                                        sx={{
                                            width: "100%",
                                        }}
                                        error={
                                            formik.touched.game && Boolean(formik.errors.game)
                                        }
                                    >
                                    <InputLabel id="game-label">Game</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="game-label"
                                            label="Game"
                                            id="game"
                                            {...formik.getFieldProps("game")}
                                        >
                                            {Array.isArray(gameList.results)
                                                ? gameList.results.map((c) => {
                                                    return (
                                                        <MenuItem value={c.id} key={c.id}>
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                }}
                                                            >
                                                                <Box sx={{ ml: 1 }}>
                                                                    {c.name}
                                                                </Box>
                                                            </Box>
                                                        </MenuItem>
                                                    );
                                                })
                                                : null}
                                        </Select>

                                        <FormHelperText>
                                            {formik.touched.game && formik.errors.game}
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="gametype"
                                        label="Game Type"
                                        {...formik.getFieldProps("gametype")}
                                        error={formik.touched.gametype && Boolean(formik.errors.gametype)}
                                        helperText={formik.touched.gametype && formik.errors.gametype}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <label>
                                        Start Date Time: 
                                    </label>

                                    <DateTimePicker 
                                        fullWidth
                                        onChange={handleDateChange}
                                        {...formik.getFieldProps("start_time")}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <label>
                                        End Date Time: 
                                    </label>

                                    <DateTimePicker 
                                        id="end_time"
                                        onChange={handleDateChange}
                                        value={getFieldProps("end_time")}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={4}
                                        id="description"
                                        label="Description"
                                        {...formik.getFieldProps("description")}
                                    />
                                </Grid>

                                <Grid item>
                                    <Box sx={{ display: "flex", margin: (theme) => theme.spacing(1), marginTop: (theme) => theme.spacing(3) }}>
                                        <Button
                                            component={Link}
                                            to='/gamestat'
                                            size="medium"
                                            variant="outlined"
                                            sx={{ mr: 2 }}>
                                            Back
                                        </Button>

                                        <Button type="submit"
                                            size="medium"
                                            variant="contained"
                                            color="primary"
                                        >
                                            Submit
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    );
                }}
            </Formik>
        </Paper>
    );
}
