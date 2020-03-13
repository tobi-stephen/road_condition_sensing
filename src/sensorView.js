import React, { Fragment, Component } from 'react';
import { View, Text, Button, ToastAndroid } from 'react-native';
import styles from './styles';
import { setUpdateIntervalForType, SensorTypes, accelerometer, gyroscope } from 'react-native-sensors';
import Geolocation from 'react-native-geolocation-service';
import { std } from 'mathjs';

const MAJOR_THRESHOLD = 10;
const MAJOR_MINOR = 7;
const MINOR_THRESHOLD = 5;
const MINOR_MILD = 3;
const MILD_THRESHOLD = 1;

const SENSOR_INTERVAL = 200;
const TIME_TO_CALIBRATE = 2000;
const ANOMALY_CHECK = 200;
const UPDATE_INTERVAL = 3000;

const SMOOTHING_PARAM = 0.1;
const LOW_PASS = 0;
const MOVING_AVERAGE = 1;

const REFRESH_LENGTH = 500;

class SensorView extends Component {

    constructor(props){
        super(props);
        this.state = {
            xdata: [],
            ydata: [],
            zdata: [],
            x: 0,
            y: 0,
            z: 0,
            gx: 0,
            gy: 0,
            gz: 0,
            timestamp: 0,
            xbase: null,
            ybase: null,
            zbase: null,
            calibration_status: false,
            anomaly: ""
        };
        
    }

    componentDidMount(){
        setUpdateIntervalForType(SensorTypes.accelerometer, SENSOR_INTERVAL); // defaults to 100ms
        setUpdateIntervalForType(SensorTypes.gyroscope, SENSOR_INTERVAL);
        
        this.anomalyInterval = setInterval(this.anomalyCheck, ANOMALY_CHECK);
        this.t = setTimeout(this.calibrate, TIME_TO_CALIBRATE);
        this.updateInterval = setInterval(() => this.props.updateData(this.state), UPDATE_INTERVAL);
        this.subscription = accelerometer
        .subscribe(
            ({x, y, z}) => {
                
                var zdata = this.state.zdata;
                var ydata = this.state.ydata;
                var xdata = this.state.xdata;
                let CALIBRATION_STATUS = this.state.calibration_status;

                if (CALIBRATION_STATUS){
                    x = this.filter(x, xdata.slice(-1)[0], LOW_PASS);
                    y = this.filter(y, ydata.slice(-1)[0], LOW_PASS);
                    z = this.filter(z, zdata.slice(-1)[0], LOW_PASS);
                }

                zdata.push(z);
                ydata.push(y);
                xdata.push(x);
                if (zdata.length > REFRESH_LENGTH) {
                    xdata = [];
                    ydata = [];
                    zdata = [];
                    console.clear();
                    // clearTimeout(this.t);
                    // this.t = setTimeout(this.calibrate, TIME_TO_CALIBRATE);
                    this.setState({calibration_status: false})
                    console.log("refresh graph data");
                }
                
                this.setState({x, y, z, xdata, ydata, zdata});
            },
            _ => {
            console.log("The sensor is not available");
            }
        );

        this.gsubscription = gyroscope
        .subscribe(
            ({x, y, z, timestamp}) => {
                var date = new Date(timestamp);
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                this.setState({gx: x, gy: y, gz: z, timestamp: formattedTime})
            },
            _ => {
                console.log("Sensor not available");
            }
        )

    }

    zthresh = (z) => {

    }

    anomalyCheck = () => {
        if (!this.state.zbase) return
        console.log('anomaly check');

        //z-thresh
        const zbase = Math.abs(this.state.z - this.state.zbase);
        // ToastAndroid.show(zbase.toString(), ToastAndroid.SHORT)
        if (zbase > MAJOR_THRESHOLD){ //POTHOLE
            console.log('Z-THRESH: ' + 'MAJOR ' + zbase)
            // ToastAndroid.show("DETECTED: Pothole", ToastAndroid.SHORT);
            this.setState({anomaly: "Pothole " + zbase});
        } else if (zbase > MINOR_THRESHOLD){ //BAD ROAD PATCHES
            console.log('Z-THRESH: ' + 'MINOR ' + zbase);
            // ToastAndroid.show("DETECTED: Bad Road Patch ", ToastAndroid.SHORT);
            this.setState({anomaly: "Bad Road Patch " + zbase});
        } else if (zbase > MINOR_MILD){
            console.log('Z-THRESH: ' + 'MINOR_MILD ' + zbase);
            // ToastAndroid.show("DETECTED: Mild Road Patch ", ToastAndroid.SHORT);
            this.setState({anomaly: "Mildly Bad " + zbase});
        } else if (zbase > MILD_THRESHOLD){  //LITTLE SHAKES
            console.log('Z-THRESH: ' + 'MILD ' + zbase);
            // ToastAndroid.show("DETECTED: Little Shakes ", ToastAndroid.SHORT);
            this.setState({anomaly: "Little shakes " + zbase});
        } else {
            // console.log('good road');
        }

        //z-diff
        const zbase2 = this.state.zdata.slice(-2)[0] - this.state.zbase
        const zdiff = Math.abs(zbase -zbase2)
        if (zdiff > MAJOR_THRESHOLD){
            console.log('Z-DIFF: ' + 'MAJOR ' + zdiff);
        } else if (zdiff > MINOR_THRESHOLD){
            console.log('Z-DIFF: ' + 'MINOR ' + zdiff);
        } else if (zdiff > MINOR_MILD){
            console.log('Z-DIFF: ' + 'MINOR_MILD ' + zdiff);
        } else if (zdiff > MILD_THRESHOLD) {
            console.log('Z-DIFF: ' + 'MILD ' + zdiff);
        } else {
            // console.log('Z-DIFF: ' + 'GOOD ROAD ' + zdiff);
        }
    }

    calibrate = () => {
        let ydata = this.state.ydata;
        let xdata = this.state.xdata;
        let zdata = this.state.zdata;

        if (ydata.length <= 0 || xdata.length <= 0) {alert('recalibrate'); return}

        xdata = xdata.slice(-6, -1);
        ydata = ydata.slice(-6, -1);
        zdata = zdata.slice(-6, -1);
        if (std(ydata) > 1 || std(xdata) > 1){
            alert("Place phone in static position");
            return;
        }
        // console.clear();
        console.log("Calibration Start");
        const ysum = ydata.reduce((a, b) => a + b)
        const ybase = ysum / ydata.length;

        const zsum = zdata.reduce((a, b) => a + b)
        const zbase = zsum / zdata.length;
        // ToastAndroid.show("zbase: " + zbase.toString(), ToastAndroid.SHORT);
        
        const xsum = xdata.reduce((a, b) => a + b)
        const xbase = xsum / xdata.length;

        this.setState({zbase, ybase, xbase, calibration_status: true});
        // alert("Calibrated");
        ToastAndroid.show('Calibrated', ToastAndroid.LONG)
    }

    filter = (currentValue, lastValue, FILTER_TYPE = LOW_PASS) => {
        if (FILTER_TYPE === LOW_PASS) {
            return lastValue * (1 - SMOOTHING_PARAM) + currentValue * SMOOTHING_PARAM;
        }
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
        this.gsubscription.unsubscribe();
        clearInterval(this.updateInterval);
        clearTimeout(this.t);
    }

    render() {
        const {zbase, anomaly, x, y, z, gz, gy, gx, timestamp} = this.state;

        return(
            <Fragment>
                <View style={styles.sectionContainer}>
                    <Button title="Calibrate" onPress={this.calibrate}/>
                    <Text style={styles.highlight}>Zbase: {zbase? zbase.toFixed(3): -1}</Text>
                    <Text style={styles.sectionTitle}>Last Detection</Text>
                    <Text style={styles.sectionDescription}>
                        <Text style={styles.highlight}>{anomaly}</Text>
                    </Text>
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Accelerometer: </Text>
                    <Text style={styles.sectionDescription}>
                        <Text style={styles.highlight}>{x.toFixed(2)}</Text>,
                        <Text style={styles.highlight}>{y.toFixed(2)}</Text>,
                        <Text style={styles.highlight}>{z.toFixed(2)}</Text>
                        <Text style={styles.highlight}> = {(Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2))).toFixed(2)}</Text>
                    </Text>
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Gyroscope</Text>
                    <Text style={styles.sectionDescription}>
                        <Text style={styles.highlight}>{gx.toFixed(2)}</Text>,
                        <Text style={styles.highlight}>{gy.toFixed(2)}</Text>,
                        <Text style={styles.highlight}>{gz.toFixed(2)}</Text>
                    </Text>
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Timestamp</Text>
                    <Text style={styles.sectionDescription}>
                        <Text style={styles.highlight}>{timestamp}</Text>                       
                    </Text>
                </View>
            </Fragment>
        );

    }
}

export default SensorView;