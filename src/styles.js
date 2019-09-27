import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    header: {
        flex: 1,
        height: 50,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: 'rgba(5, 165, 209,.25)',
        fontWeight: 'bold',
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        backgroundColor: 'rgba(5, 165, 209,.25)',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: 'black',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default styles;