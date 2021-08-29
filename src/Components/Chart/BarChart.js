import React from 'react';
import {Bar} from 'react-chartjs-2';

const BarChart = React.memo((props) => {
    return (
        <div style={{width: "500px", margin: "0 auto"}}>
            <Bar
                data={{
                    labels: Object.keys(props.data),
                    datasets: [
                        {
                            label: 'No of policies per year based on region',
                            data: Object.values(props.data),
                            backgroundColor: [
                                'rgba(54,54,219,0.2)',
                            ],
                            borderColor: [
                                'rgb(18,106,247)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                }}
            />
        </div>
    );
});

export default BarChart;