import React, {Component, Fragment} from 'react';
import { ScrollView, StatusBar, View, Text, Button, } from 'react-native';
import SensorView from './sensorView';
import GeoView from './geoView';
import ChartView from './chartView';

import styles from './styles.js'

class Main extends Component {
    
    constructor(){
        super();
        this.state = {
            sensorData: null,
            geoPostion: {},
            activeAxis: 'zdata',
        }
        this.updateSensorData = this.updateSensorData.bind(this);
        this.updateGeoPosition = this.updateGeoPosition.bind(this);
    }

    updateSensorData(sensorData){
        // console.log(JSON.stringify(sensorData));
        this.setState({sensorData});
    }

    updateGeoPosition(geoPostion){
        // console.log(JSON.stringify(geoPostion));
    }

    render() {
        return(
            <Fragment>
                <StatusBar barStyle="dark-content" />
                <ScrollView style={styles.main}>
                    <View style={{flex: 1, flexDirection: 'row', ...styles.header}}>
                        <Text style={{flex: 3}}>Hello World</Text>
                        <View style={{flex: 4, flexDirection: 'row'}}>
                            <Button color={'red'} title={'x'} onPress={() => this.setState({activeAxis: 'xdata'})} />
                            <Button color={'green'} title={'y'} onPress={() => this.setState({activeAxis: 'ydata'})} />
                            <Button color={'blue'} title={'z'} onPress={() => this.setState({activeAxis: 'zdata'})} />
                        </View>
                        <Text style={{flex: 2}}>{this.state.activeAxis.toUpperCase()}</Text>
                    </View>
                    <ChartView sensorData={this.state.sensorData} activeAxis={this.state.activeAxis}/>
                    <SensorView updateData={this.updateSensorData} />
                    <GeoView updateData={this.updateGeoPosition} />
                    <View style={{height: 50}}></View>
                </ScrollView>
            </Fragment>
        );
    }
}

export default Main;


















// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
//   PermissionsAndroid, Button,
//   processColor,
// } from 'react-native';
// import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
// import { AreaChart, LineChart, Grid, YAxis } from 'react-native-svg-charts';
// import * as shape from 'd3-shape';

// // import {LineChart as LC } from 'react-native-charts-wrapper';


// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
// var PushNotification = require('react-native-push-notification');

// import {
//     accelerometer,
//     gyroscope,
//     setUpdateIntervalForType,
//     SensorTypes
// } from "react-native-sensors";
// import { map, filter } from "rxjs/operators";

// class Main extends React.Component {

//     constructor(){
//         super()
//         this.id = 0;
//         this.state = {
//             xdata: [],
//             ydata: [],
//             zdata: [],
//             test: [],
//             x: 0,
//             y: 0,
//             z: 0,
//             speed: 0,
//             gx: 0,
//             gy: 0,
//             gz: 0,
//             timestamp: '',
//             tripDuration: 0,
//             region: {
//                 latitude: 37.78825,
//                 longitude: -122.4324,
//                 latitudeDelta: 0.0922,
//                 longitudeDelta: 0.0421,
//               },
//             marker: {
//                 latlng: {
//                     latitude: 37.78825,
//                     longitude: -122.4324,
//                 },
//                 title: "here",
//                 desc: "desc of here"
//             }
//         }
//     }

//     onRegionChange = (region) => {
//         console.log(`Region: ${JSON.stringify(region)}`)
//         this.setState({region});
//     }

    

//     async componentDidMount(){
//             setUpdateIntervalForType(SensorTypes.accelerometer, 400); // defaults to 100ms
//             setUpdateIntervalForType(SensorTypes.gyroscope, 400);
//             console.log("reach here")

//             PushNotification.configure({
//                 onNotification: (notif) => {
//                     console.log("NOTIF: ", notif);
//                 },

//                 popInitialNotification: false,
//                 requestPermissions: true
//             })

           
            

//             this.subscription = accelerometer
//             .subscribe(
//                 ({x, y, z}) => {
//                     let speed = x+ y + z; //Math.sqrt(x*x + y*y+ z*z);
//                     // let test = this.state.test;
//                     // test.push((y-9.81).toFixed(3));
//                     // console.log(`test: ${(y-9.81).toFixed(4)}`); 

//                     var zdata = this.state.zdata;
                    
//                     zdata.push(z);
//                     var ydata = this.state.ydata;
//                     ydata.push(y);
//                     var xdata = this.state.xdata;
//                     xdata.push(x);
//                     if (zdata.length > 100) {
//                         xdata = [];
//                         ydata = [];
//                         zdata = [];
//                         // alert("reached 100")
//                     }

//                     // console.log(`data: ${data}`)
//                     speed = (speed).toFixed(2);
//                     x = x.toFixed(2);
//                     y = y.toFixed(2);
//                     z = z.toFixed(2);
//                     // console.log(`You moved your phone with ${speed}`);
//                     // console.log(`Accelerometer - x: ${x}, y: ${y}, z: ${z}`);
//                     this.setState({x, y, z, speed, xdata, ydata, zdata});
//                 },
//                 _ => {
//                 console.log("The sensor is not available");
//                 }
//             );

//             this.gsubscription = gyroscope
//             .subscribe(
//                 ({x, y, z, timestamp}) => {
//                     var date = new Date(timestamp);
//                     // Hours part from the timestamp
//                     var hours = date.getHours();
//                     // Minutes part from the timestamp
//                     var minutes = "0" + date.getMinutes();
//                     // Seconds part from the timestamp
//                     var seconds = "0" + date.getSeconds();
//                     gx = x.toFixed(2);
//                     gy = y.toFixed(2);
//                     gz = z.toFixed(2);
//                     // Will display time in 10:30:23 format
//                     var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
//                     // console.log(`Gyro - x: ${x}, y: ${y}, z: ${z}`);
//                     // console.log(`Timestamp - ${timestamp}: ${formattedTime}`);
//                     this.setState({gx, gy, gz, timestamp: formattedTime})
//                 },
//                 error => {
//                     console.log("Sensor not available");
//                 }
//             )

//             try {
//                 const granted = await PermissionsAndroid.request(
//                     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                     {
//                         title: 'Query Location',
//                         message: 'Query a location',
//                         buttonNeutral: 'Ask Me Later',
//                         buttonNegative: 'Cancel',
//                         buttonPositive: 'OK',
//                     },
//                 );
//                 if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//                     // alert("access to location granted");
//                     this.watchid = Geolocation.watchPosition(
//                         (position) => {
//                             console.log(`GeoLoc Pos: ${JSON.stringify(position)}`)
//                             region = {
//                                 latitude: position.coords.latitude,
//                                 longitude: position.coords.longitude,
//                                 latitudeDelta: 0.0922,
//                                 longitudeDelta: 0.0421,
//                             }
//                             this.setState({region})
//                             marker = {
//                                 latlng: {
//                                     latitude: position.coords.latitude,
//                                     longitude: position.coords.longitude,
//                                 },
//                                 title: "here",
//                                 desc: "desc of here"
//                             } 
//                             this.setState({marker});
//                             // alert(JSON.stringify(position));
//                         },
//                         (error) => {
//                             console.log(`GeoLoc error: ${JSON.stringify(error)}`)
//                         },
//                         { enableHighAccuracy: true, interval: 10000, fastestInterval: 5000, distanceFilter: 0 },

//                     );
//                 } else {
//                     console.log("no permission")
//                 }
//              } catch (err) {
//                     console.log(err.message)
//                 }



//         // setTimeout(() => {
//         // // If it's the last subscription to accelerometer it will stop polling in the native API
//         // subscription.unsubscribe();
//         // }, 3000);
//     }

//     componentWillUnmount(){
//         this.subscription.unsubscribe();
//         this.gsubscription.unsubscribe();
//         Geolocation.clearWatch(this.watchid);
//     }

//     render(){
//         const {xdata, ydata, zdata, x, y, z, gx, gy, gz, speed, timestamp, region, marker} = this.state;
//         // const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]


//         return (
//             <Fragment>
//               <StatusBar barStyle="dark-content" />
//               <SafeAreaView>
//                 <ScrollView
//                   contentInsetAdjustmentBehavior="automatic"
//                   style={styles.scrollView}>
//                   {/* <Header /> */}
                  
//                   {global.HermesInternal == null ? null : (
//                     <View style={styles.engine}>
//                       <Text style={styles.footer}>Engine: Hermes</Text>
//                     </View>
//                   )}
//                   <View style={styles.body}>
//                     <View style={{}}>
//                         <Text style={{textAlign: 'center', ...styles.sectionTitle, color: 'green',}}>Hello World</Text>
//                         {/* <Button title="CLEAR" onPress={() => {this.setState({xdata: [], ydata: [], zdata: []})}}></Button> */}

//                         {/* <View style={{flexDirection: 'row', ...styles.sectionContainer}}> */}
//                             <MapView
//                                 style={styles.map}
//                                 provider={PROVIDER_GOOGLE}
//                                 region={this.state.region}
//                                 onRegionChange={this.onRegionChange}
//                                 showUserLocation={true}
//                                 showsMyLocationButton={true}
//                                 showsCompass={true}
//                             >
//                                 <Marker
//                                     coordinate={this.state.marker.latlng}
//                                     title={marker.title}
//                                     description={marker.desc}
//                                     />

//                             </MapView>
//                             {/* <YAxis
//                                 data = {zdata}
//                                 contentInset={{ top: 20, bottom: 20 }}
//                                 numberOfTicks={10}
//                                 svg={{
//                                     fill: 'grey',
//                                     fontSize: 10,
//                                 }}
                                
//                                 formatLabel={(value) => `${value}`}
//                                 />

//                             <LineChart
//                                 style={{flex: 1, marginLeft:16,  height: 300 }}
//                                 data={zdata}
//                                 svg={{ stroke: 'rgb(134, 65, 244)' }}
//                                 // curve={shape.curveNatural}
//                                 contentInset={{ top: 20, bottom: 20 }}
//                             >
//                                 <Grid />
//                             </LineChart> */}
//                             {/* <Button onPress={() => {
//                                 PushNotification.checkPermissions((perm) => {
//                                     console.log(`perm: ${JSON.stringify(perm)}`)
//                                 })
//                             }} title={"check permissions"}/>

//                             <Button onPress={() => {
//                                 PushNotification.localNotification({
//                                     id: ''+2,
//                                     ticker: "My Notification Ticker", // (optional)
//                                     autoCancel: true, // (optional) default: true
//                                     largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
//                                     smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
//                                     bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
//                                     subText: "This is a subText", // (optional) default: none
//                                     color: "red", // (optional) default: system default
//                                     vibrate: true, // (optional) default: true
//                                     vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
//                                     tag: 'some_tag', // (optional) add tag to message
//                                     group: "group", // (optional) add group to message
//                                     ongoing: false, // (optional) set whether this is an "ongoing" notification

//                                     title: "Local Notification", // (optional)
//                                     message: "My Notification Message", // (required)
//                                     playSound: false, // (optional) default: true
//                                     soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
//                                     number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
//                                     actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
//                                 })
//                             }} title={"local notification"}/> */}

//                          {/* </View> */}
//                          {/* <View style={{flexDirection: 'row', ...styles.sectionContainer}}>
//                             <YAxis
//                                 data = {ydata}
//                                 contentInset={{ top: 20, bottom: 20 }}
//                                 numberOfTicks={10}
//                                 svg={{
//                                     fill: 'grey',
//                                     fontSize: 10,
//                                 }}
                                
//                                 formatLabel={(value) => `${value}`}
//                                 />

//                             <LineChart
//                                 style={{flex: 1, marginLeft:16,  height: 300 }}
//                                 data={ydata}
//                                 svg={{ stroke: 'rgb(134, 65, 244)' }}
//                                 curve={shape.curveNatural}
//                                 contentInset={{ top: 20, bottom: 20 }}
//                             >
//                                 <Grid />
//                             </LineChart>

//                          </View> */}
//                          {/* <View style={{flexDirection: 'row', ...styles.sectionContainer}}>
//                             <YAxis
//                                 data = {xdata}
//                                 contentInset={{ top: 20, bottom: 20 }}
//                                 numberOfTicks={10}
//                                 svg={{
//                                     fill: 'grey',
//                                     fontSize: 10,
//                                 }}
                                
//                                 formatLabel={(value) => `${value}`}
//                                 />

//                             <LineChart
//                                 style={{flex: 1, marginLeft:16,  height: 300 }}
//                                 data={xdata}
//                                 svg={{ stroke: 'rgb(134, 65, 244)' }}
//                                 curve={shape.curveNatural}
//                                 contentInset={{ top: 20, bottom: 20 }}
//                             >
//                                 <Grid />
//                             </LineChart>

//                          </View>
//                           */}
//                     </View>
//                     <View style={{marginTop: 200}}></View>
//                     <View  style={styles.sectionContainer}>
//                     {/* <Button title="CLEAR" onPress={() => {this.setState({xdata: [], ydata: [], zdata: []})}}></Button> */}
//                     <Text style={styles.sectionTitle}>Region: </Text>
//                       <Text style={styles.sectionDescription}>
//                        <Text style={styles.highlight}>{region.latitude}</Text>, 
//                        <Text style={styles.highlight}>{region.longitude}</Text>
//                       </Text>
//                     </View>
//                     <View  style={styles.sectionContainer}>
//                     <Text style={styles.sectionTitle}>Accelerometer: </Text>
//                       <Text style={styles.sectionDescription}>
//                        <Text style={styles.highlight}>{x}</Text>, 
//                        <Text style={styles.highlight}>{y}</Text>, 
//                         <Text style={styles.highlight}>{z}</Text>
//                       </Text>
//                     </View>
//                     <View style={styles.sectionContainer}>
//                       <Text style={styles.sectionTitle}>Gyroscope</Text>
//                       <Text style={styles.sectionDescription}>
//                        <Text style={styles.highlight}>{gx}</Text>,
//                       <Text style={styles.highlight}>{gy}</Text>,
//                       <Text style={styles.highlight}>{gz}</Text>
//                       </Text>
//                     </View>
//                     <View style={styles.sectionContainer}>
//                       <Text style={styles.sectionTitle}>Speed</Text>
//                       <Text style={styles.sectionDescription}>
//                        <Text style={styles.highlight}>{speed}</Text>
//                       </Text>
//                     </View>
//                     <View style={styles.sectionContainer}>
//                       <Text style={styles.sectionTitle}>Timestamp</Text>
//                       <Text style={styles.sectionDescription}>
//                        <Text style={styles.highlight}>{timestamp}</Text>
//                       </Text>
//                     </View>
//                     <View style={styles.sectionContainer}>
//                       <MapView>

//                       </MapView>
//                     </View>
//                   </View>
//                 </ScrollView>
//               </SafeAreaView>
//             </Fragment>
//           );
//         }
  
// };

// const styles = StyleSheet.create({
//     container: {
//         ...StyleSheet.absoluteFillObject,
//         height: 400,
//         width: 400,
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//       },
//       map: {
//         ...StyleSheet.absoluteFillObject,
//         height: 200,
//         width: 400,
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//       },
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

// export default Main;
