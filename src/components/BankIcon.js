import { StyleSheet, Image } from 'react-native';
import React from 'react';

const BankIcon = ({ bank }) => {
  if (bank === null) {
    return (
      <Image
        source={require('../../assets/banks/bog.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'SCB') {
    return (
      <Image source={require('../../assets/banks/sc.png')} style={styles.img} />
    );
  }
  if (bank === 'ABN') {
    return (
      <Image
        source={require('../../assets/banks/absa.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'GCB') {
    return (
      <Image
        source={require('../../assets/banks/gcb.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'NIB') {
    return (
      <Image
        source={require('../../assets/banks/nib.jpeg')}
        style={styles.img}
      />
    );
  }
  if (bank === 'UBA') {
    return (
      <Image
        source={require('../../assets/banks/uba.jpeg')}
        style={styles.img}
      />
    );
  }
  if (bank === 'ARB') {
    return (
      <Image
        source={require('../../assets/banks/apex.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'ADB') {
    return (
      <Image
        source={require('../../assets/banks/adb.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'N/A') {
    return (
      <Image
        source={require('../../assets/banks/sgg.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'UMB') {
    return (
      <Image
        source={require('../../assets/banks/umb.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'HFC') {
    return (
      <Image
        source={require('../../assets/banks/republic.webp')}
        style={styles.img}
      />
    );
  }

  if (bank === 'ZBL') {
    return (
      <Image
        source={require('../../assets/banks/zenith.png')}
        style={styles.img}
      />
    );
  }

  if (bank === 'EBG') {
    return (
      <Image
        source={require('../../assets/banks/ecobank.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'CAL') {
    return (
      <Image
        source={require('../../assets/banks/calbank.webp')}
        style={styles.img}
      />
    );
  }
  if (bank === 'FAB') {
    return (
      <Image
        source={require('../../assets/banks/fab.webp')}
        style={styles.img}
      />
    );
  }
  if (bank === 'PBL') {
    return (
      <Image
        source={require('../../assets/banks/prudential.jpeg')}
        style={styles.img}
      />
    );
  }
  if (bank === 'SBG') {
    return (
      <Image
        source={require('../../assets/banks/stanbic.jpeg')}
        style={styles.img}
      />
    );
  }
  if (bank === 'FBN') {
    return (
      <Image
        source={require('../../assets/banks/firstbank.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'BOA') {
    return (
      <Image
        source={require('../../assets/banks/boa.jpeg')}
        style={styles.img}
      />
    );
  }
  if (bank === 'GTB') {
    return (
      <Image source={require('../../assets/banks/gt.png')} style={styles.img} />
    );
  }
  if (bank === 'FBL') {
    return (
      <Image
        source={require('../../assets/banks/fidelity.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'OMB') {
    return (
      <Image
        source={require('../../assets/banks/omni.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'ABG') {
    return (
      <Image
        source={require('../../assets/banks/access.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'FNB') {
    return (
      <Image
        source={require('../../assets/banks/fnb.png')}
        style={styles.img}
      />
    );
  }
  if (bank === 'CBG') {
    return (
      <Image
        source={require('../../assets/banks/cbg.png')}
        style={styles.img}
      />
    );
  }
};

export default BankIcon;

const styles = StyleSheet.create({
  img: {
    height: 48,
    width: 48,
    borderRadius: 118,
    borderColor: '#eee',
    borderWidth: 1,
  },
});
