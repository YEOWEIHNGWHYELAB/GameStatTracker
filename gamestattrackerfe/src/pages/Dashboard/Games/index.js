import React, { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import axios from "axios";

import getCommonOptions from 'src/helpers/axios/getCommonOptions';
import formatHttpApiError from 'src/helpers/formatHttpApiError';
import StatChart from "./StatChart";
import Filters from "./Filters";

// Generate a random hexadecimal color code
function randomColor() {
    const hexDigits = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += hexDigits[Math.floor(Math.random() * 16)];
    }

    return color;
}

// Create a new array with updated color values
function assignColors(tableData) {
    const updatedTableData = tableData.map(item => ({
        ...item,
        color: randomColor()
    }));

    return updatedTableData;
}

// Create charData that can be used in the chart using response gotten from API
// data = [] represents the response obtained
const generateChartData = (data = []) => {
    let chartData = {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }
        ]
    };

    data.forEach((d => {
        chartData.labels.push(d.name);
        chartData.datasets[0].data.push(d.count);
        chartData.datasets[0].backgroundColor.push(d.color);
        chartData.datasets[0].borderColor.push(d.color);
    }));

    return chartData;
};

const generateTableData = (data = []) => {
    const dataForTable = data.map((d) => {
        return {
            label: d.name,
            color: d.color,
            count: d.count
        };
    });

    return dataForTable;
};

const baseApiUrl = "/gamebygame/";

export default function TaskByCategory() {
    const { enqueueSnackbar } = useSnackbar();

    const [queries, setQueries] = useState({
        win: "all"
    });

    const [apiUrl, setApiUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (queries.win === "True" || queries.win === "False") {
            setApiUrl(`${baseApiUrl}?win=${queries.win}`);
            return;
        };

        setApiUrl(baseApiUrl);
    }, [queries]);

    useEffect(() => {
        if (!apiUrl) {
            return;
        }

        setIsLoading(true);

        axios.get(apiUrl, getCommonOptions())
            .then((res) => {
                const { data } = res;

                if (data) {
                    const updatedData = assignColors(data);
                    setTableData(generateTableData(updatedData));
                    setChartData(generateChartData(updatedData));
                }
                
                setIsLoading(false);
            }).catch((err) => {
                setIsLoading(false);
                const formattedError = formatHttpApiError(err);
                enqueueSnackbar(formattedError);
            })
    }, [enqueueSnackbar, setIsLoading, setTableData, setChartData, apiUrl])

    return (
        <StatChart 
            tableData={tableData} 
            chartData={chartData} 
            isLoading={isLoading} 
            filters={<Filters setQueries={setQueries} />} 
        />
    )
}
