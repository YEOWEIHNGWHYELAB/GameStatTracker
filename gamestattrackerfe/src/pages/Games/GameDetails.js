import React, { useEffect, useState } from 'react'
import { Formik } from "formik";
import { Grid, TextField, Typography, Paper, Button, Box } from "@mui/material";
import * as yup from 'yup';
import { Link, useNavigate, useParams } from "react-router-dom";

import useRequestResource from 'src/hooks/useRequestResource';
import { FormatLineSpacing } from '@mui/icons-material';

const validationSchema = yup.object({
    name: yup.string().required("New Game is Required!").max(100, "Max Length is 100!"),
})

export default function CategoryDetails() {
    const { addResource , resource, getResource, updateResource } = useRequestResource({ endpoint: "game", resourceLabel:"Games" });
    const [ initialValues, setInitialValues ] = useState({
        name: ""
    });

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getResource(id);
        }
    }, [id, getResource]);

    useEffect(() => {
        if (resource) {
            setInitialValues({
                name: resource.name,
            })
        }
    }, [resource]);

    const handleSubmit = values => {
        const formattedValues = {
            name: values.name,
        }
        if (id) {
            updateResource(id, formattedValues, () => {
                navigate("/game")
            })
            return;
        }
        addResource(formattedValues, () => {
            navigate("/game")
        })
    }

  return (
    <Paper sx = {{
        borderRadius: "2px",
        bpxShadow: (theme) => theme.shadows[4],
        padding: (theme) => theme.spacing(2, 4, 3)
    }}>
        <Typography variant = "h6" mh={4}>
            {id ? "Edit Game" : "Add New Game"}
        </Typography>

        <Formik onSubmit = {handleSubmit} 
            initialValues = {initialValues}
            enableReinitialize
            validationSchema = {validationSchema}
        >
            {
                (formik) => {
                    return (
                        <form onSubmit = { formik.handleSubmit }>
                            <Grid container spacing={3}>
                                <Grid item xs={12}> 
                                    <TextField 
                                        fullWidth 
                                        id = "name" 
                                        label = "Name"
                                        {...formik.getFieldProps('name')} 
                                        error = {formik.touched.name && Boolean(formik.errors.name)}
                                        helperText = {formik.touched.name && formik.errors.name}
                                        />
                                </Grid>

                                <Grid item>
                                    <Box sx={{display: "flex", margin: (theme) => theme.spacing(1), marginTop: (theme) => theme.spacing(3)}}/>
                                        <Button component = {Link} 
                                            to = "/game"
                                            size = "medium"
                                            variant = "outlined"
                                            sx = {{ mr: 2 }}>
                                                Back
                                        </Button>
                                        <Button 
                                            type = "submit"
                                            size = "medium"
                                            variant = "contained"
                                            color = "primary">
                                                Submit
                                        </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )
                }
            }
        </Formik>
    </Paper>
  )
}
