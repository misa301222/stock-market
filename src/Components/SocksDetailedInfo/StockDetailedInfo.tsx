import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import moment from "moment";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import StockCardBig from "../Cards/StockCardBig";

interface Stock {
    stockName: string,
    stockDescription: string,
    stockPrice: number,
    stockQuantity: number,
    stockLogoURL: string,
    dateAdded: Date,
    stockOwner: string
}

interface StockHistory {
    stockId: number,
    stockName: string,
    stockDate: any,
    stockPrice: number
}

const STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/StockHistories`;
const STOCK_URL = `${process.env.REACT_APP_API_URL}/Stocks`;

function StockDetailedInfo() {
    const params = useParams();
    const [stockHistory, setStockHistory] = useState<StockHistory[]>();
    const [dataChart, setDataChart] = useState<any>();
    const [optionsChart, setOptionsChart] = useState<any>();
    const [stock, setStock] = useState<Stock>();

    const buildChart = async () => {
        Chart.register(...registerables);

        const response = await axios.get(`${STOCK_HISTORY_URL}/GetStockHistoryByStockNameAscending/${params.stockName}`);

        let dates: string[] = [];
        let values: number[] = [];
        for (let i = 0; i < response.data.length; i++) {
            dates[i] = moment(response.data[i].stockDate).format('MM/DD/YYYY');
            values[i] = response.data[i].stockPrice;
        }

        const data = {
            labels: dates,
            datasets: [
                {
                    label: `${params.stockName}`,
                    data: values,
                    borderColor: '#000000',
                    backgroundColor: '#FAA0A0',
                    fill: true,
                    stepped: true,
                }
            ]
        };

        const options: any = {
            responsive: true,
            interaction: {
                intersect: false,
                axis: 'x'
            },
            plugins: {
                title: {
                    display: true,
                    text: (ctx: any) => 'Step ' + ctx.chart.data.datasets[0].stepped + ' Interpolation',
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Day of The Month',
                        color: '#911',
                        font: {
                            family: 'Arial',
                            size: 20,
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                        padding: { top: 20, left: 0, right: 0, bottom: 0 }
                    }
                },
                y: {
                    display: true,
                    title: {
                      display: true,
                      text: 'Price',
                      color: '#191',
                      font: {
                        family: 'Arial',
                        size: 20,
                        style: 'normal',
                        lineHeight: 1.2
                      },
                      padding: {top: 30, left: 0, right: 0, bottom: 0}
                    }
                  }
            
            }
        }

        setDataChart(data);
        setOptionsChart(options);
    }

    const getStockHistoryByStockName = async (stockName: string) => {
        await axios.get(`${STOCK_HISTORY_URL}/GetStockHistoryByStockName/${stockName}`).then(response => {
            setStockHistory(response.data);
        }).catch(err => {
            console.log(err);
        })
    }

    const getStockByStockName = async (stockName: string) => {
        await axios.get(`${STOCK_URL}/${stockName}`).then(response => {
            console.log(response);
            setStock(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        const stockName: string = params.stockName!;
        //getStockHistoryByStockName(stockName);
        getStockByStockName(params.stockName!);
        buildChart();
    }, [])

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Stock Detailed Information <FontAwesomeIcon icon={faArrowTrendUp} /></h1>
                <hr />
            </div>

            <div className="mt-20">
                {
                    stock ?
                        <StockCardBig stock={stock} />
                        : null
                }
            </div>

            <div className="w-2/3 mx-auto mt-10">
                {
                    dataChart ?
                        <Line data={dataChart} options={optionsChart} />
                        : null
                }

            </div>
        </div>
    )
}

export default StockDetailedInfo;