import React, { Fragment, Component } from 'react';
import { View, Text, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import styles from './styles';

class GeoView extends Component {

    constructor(props){
        super(props);
        this.state = {
            position: null,
        }
    }

    async componentDidMount() {

        this.updateInterval = setInterval(() => this.props.updateData(this.state), 5000);

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Query Location',
                    message: 'Query a location',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("access to location granted");
                this.watchid = Geolocation.watchPosition(
                    (position) => {
                        this.setState({position});
                        // console.log(JSON.stringify(position));
                    },
                    (error) => {
                        console.log(`GeoLoc error: ${JSON.stringify(error)}`)
                    },
                    { enableHighAccuracy: true, interval: 10000, fastestInterval: 5000, distanceFilter: 0 },

                );
            } else {
                console.log("no permission")
            }
        } catch (err) {
            console.log(err.message)
        }

    }

    componentWillUnmount(){
        Geolocation.clearWatch(this.watchid);
        clearInterval(this.updateInterval);
    }

    render() {
        const {position} = this.state;

        return(
            <Fragment>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Region: </Text>
                    <Text style={styles.sectionDescription}>
                        <Text style={styles.highlight}>{position ? position.coords.latitude: 'none'}</Text>,
                        <Text style={styles.highlight}>{position ? position.coords.longitude: 'none'}</Text>
                    </Text>
                </View>
            </Fragment>
        );

    }
}

export default GeoView;