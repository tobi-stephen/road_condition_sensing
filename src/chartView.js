import React, { Fragment, Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { AreaChart, LineChart, Grid, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import styles from './styles';

class ChartView extends Component {

    render() {
        let data = [0];
        if (this.props.sensorData){
            const activeAxis = this.props.activeAxis;
            data = this.props.sensorData[activeAxis];
            if (data.length <= 0) data = [0];
        }

        return (
            <Fragment>
                <View style={{flexDirection: 'row', ...styles.sectionContainer}}>
                    <YAxis
                        data = {data}
                        contentInset={{ top: 20, bottom: 20 }}
                        numberOfTicks={10}
                        svg={{
                            fill: 'grey',
                            fontSize: 10,
                        }}
                        
                        formatLabel={(value) => `${value}`}
                        />
                    <LineChart
                        style={{flex: 1, marginLeft:16,  height: 300 }}
                        data={data}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                        contentInset={{ top: 20, bottom: 20 }}
                        >
                        <Grid />
                    </LineChart>
                </View>
            </Fragment>
        );
    }

};

export default ChartView;